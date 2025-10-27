import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UseGuards,
  Req,
  HttpStatus,
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import * as contentDisposition from "content-disposition";
import { Response, Request } from "express";
import { CreateShareGuard } from "src/share/guard/createShare.guard";
import { ShareOwnerGuard } from "src/share/guard/shareOwner.guard";
import { FileService } from "./file.service";
import { FileSecurityGuard } from "./guard/fileSecurity.guard";
import * as mime from "mime-types";
import { SHARE_DIRECTORY } from "src/constants";
import { createReadStream } from "fs";

@Controller("shares/:shareId/files")
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  @SkipThrottle()
  @UseGuards(CreateShareGuard, ShareOwnerGuard)
  async create(
    @Query()
    query: {
      id: string;
      name: string;
      chunkIndex: string;
      totalChunks: string;
    },
    @Body() body: string,
    @Param("shareId") shareId: string,
  ) {
    const { id, name, chunkIndex, totalChunks } = query;

    // Data can be empty if the file is empty
    return await this.fileService.create(
      body,
      { index: parseInt(chunkIndex), total: parseInt(totalChunks) },
      { id, name },
      shareId,
    );
  }

  @Get("zip")
  @UseGuards(FileSecurityGuard)
  async getZip(
    @Res({ passthrough: true }) res: Response,
    @Param("shareId") shareId: string,
  ) {
    const zipStream = await this.fileService.getZip(shareId);

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": contentDisposition(`${shareId}.zip`),
    });

    return new StreamableFile(zipStream);
  }

  @Get(":fileId")
  @UseGuards(FileSecurityGuard)
  async getFile(
    @Res() res: Response,
    @Req() req: Request,
    @Param("shareId") shareId: string,
    @Param("fileId") fileId: string,
    @Query("download") download = "true",
  ) {
    const file = await this.fileService.get(shareId, fileId);

    const totalSize = Number(file.metaData.size ?? 0);

    // Prepare common headers
    const contentType =
      mime?.lookup?.(file.metaData.name) || "application/octet-stream";

    const disposition =
      download === "true"
        ? contentDisposition(file.metaData.name)
        : contentDisposition(file.metaData.name, { type: "inline" });

    // If a Range header is present, try to handle partial request (important for seeking)
    const rangeHeader = req.headers.range;
    if (rangeHeader) {
      // Only support byte ranges: 'bytes=start-end'
      const range = (rangeHeader as string).replace(/bytes=/, "");
      const parts = range.split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      // Validate range
      if (isNaN(start) || isNaN(end) || start > end || start < 0 || end >= totalSize) {
        res.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
        res.set({ "Content-Range": `bytes */${totalSize}` });
        return res.end();
      }

      const chunkSize = end - start + 1;

      // Try to handle local file ranged streaming
      try {
        const filePath = `${SHARE_DIRECTORY}/${shareId}/${fileId}`;
        const stream = createReadStream(filePath, { start, end });

        res.status(HttpStatus.PARTIAL_CONTENT);
        res.set({
          "Content-Range": `bytes ${start}-${end}/${totalSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": contentType,
          "Content-Disposition": disposition,
          "Content-Security-Policy": "sandbox",
        });

        // Pipe the stream and return
        stream.on("open", () => stream.pipe(res));
        stream.on("error", (err) => {
          // If the file can't be read here, fall back to streaming the full file
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
        });

        return;
      } catch (err) {
        // Fall through to full streaming below
      }
    }

    // No range requested or range handling failed - stream the full file
    const headers = {
      "Content-Type": contentType,
      "Content-Length": file.metaData.size,
      "Content-Security-Policy": "sandbox",
      AcceptRanges: "bytes",
      "Content-Disposition": disposition,
    } as Record<string, any>;

    res.set(headers);

    // Pipe the provided readable stream to the response
    const stream = file.file;
    stream.on("error", () => res.status(HttpStatus.INTERNAL_SERVER_ERROR).end());
    stream.pipe(res);

    return;
  }

  @Delete(":fileId")
  @SkipThrottle()
  @UseGuards(ShareOwnerGuard)
  async remove(
    @Param("fileId") fileId: string,
    @Param("shareId") shareId: string,
  ) {
    await this.fileService.remove(shareId, fileId);
  }
}

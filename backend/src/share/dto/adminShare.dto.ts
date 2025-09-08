import { OmitType } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { ShareDTO } from "./share.dto";

export class AdminShareDTO extends OmitType(ShareDTO, [
  "files",
  "from",
  "fromList",
] as const) {
  @Expose()
  views: number;

  @Expose()
  createdAt: Date;

  // Re-expose reverseShare from base DTO (OmitType keeps it since not omitted)
  @Expose()
  reverseShare?: { name?: string };

  from(partial: Partial<AdminShareDTO>) {
    return plainToClass(AdminShareDTO, partial, {
      excludeExtraneousValues: true,
    });
  }

  fromList(partial: Partial<AdminShareDTO>[]) {
    return partial.map((part) =>
      plainToClass(AdminShareDTO, part, { excludeExtraneousValues: true }),
    );
  }
}

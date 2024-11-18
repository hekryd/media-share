import { LoadingOverlay, Group, Box, Title, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import showErrorModal from "../../../components/share/showErrorModal";
import shareService from "../../../services/share.service";
import { Share as ShareType } from "../../../types/share.type";
import useTranslate from "../../../hooks/useTranslate.hook";
import EditableUpload from "../../../components/upload/EditableUpload";
import Meta from "../../../components/Meta";
import DownloadAllButton from "../../../components/share/DownloadAllButton";

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { shareId: context.params!.shareId },
  };
}

const Share = ({ shareId }: { shareId: string }) => {
  const t = useTranslate();
  const modals = useModals();
  const [isLoading, setIsLoading] = useState(true);
  const [share, setShare] = useState<ShareType>();

  useEffect(() => {
    shareService
      .getFromOwner(shareId)
      .then((share) => {
        setShare(share);
      })
      .catch((e) => {
        const { error } = e.response.data;
        if (e.response.status == 404) {
          if (error == "share_removed") {
            showErrorModal(
              modals,
              t("share.error.removed.title"),
              e.response.data.message,
            );
          } else {
            showErrorModal(
              modals,
              t("share.error.not-found.title"),
              t("share.error.not-found.description"),
            );
          }
        } else if (e.response.status == 403 && error == "share_removed") {
          showErrorModal(
            modals,
            t("share.error.access-denied.title"),
            t("share.error.access-denied.description"),
          );
        } else {
          showErrorModal(modals, t("common.error"), t("common.error.unknown"));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <LoadingOverlay visible />;

  return (
      <>
        <Meta title={t("share.edit.title", { shareId })} />
          <Group position="apart" mb="26px" style={{width:"100%", display:"flex", justifyContent:"space-between"}}>
              <Box style={{ maxWidth: "70%" }}>
                  <Title order={3}>{share?.description}</Title>
                  <Text size="sm">{share?.id}</Text>
              </Box>
              {share?.files.length > 1 && <DownloadAllButton shareId={shareId} />}
          </Group>
        <EditableUpload shareId={shareId} files={share?.files || []} />
      </>
  );
};

export default Share;
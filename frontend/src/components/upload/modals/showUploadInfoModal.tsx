import { ModalsContextProps } from "@mantine/modals/lib/context";
import { Button, Stack, Text } from "@mantine/core";
import { translateOutsideContext } from "../../../hooks/useTranslate.hook";

const showUploadInfoModal = (modals: ModalsContextProps) => {
  const t = translateOutsideContext();

  return modals.openModal({
    title: "",
    children: (
      <Stack align="stretch">
        <Text sx={{ whiteSpace: "pre-line" }}>
          {t("index.uploadTitleTooltip")}
        </Text>
        <Button onClick={() => modals.closeAll()}>
          {t("common.button.confirm")}
        </Button>
      </Stack>
    ),
  });
};

export default showUploadInfoModal;

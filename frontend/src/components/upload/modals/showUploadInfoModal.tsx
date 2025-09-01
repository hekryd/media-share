import { ModalsContextProps } from "@mantine/modals/lib/context";
import { Stack, Text } from "@mantine/core";
import { translateOutsideContext } from "../../../hooks/useTranslate.hook";

const showUploadInfoModal = (modals: ModalsContextProps) => {
  const t = translateOutsideContext();

  return modals.openModal({
    title: "",
    children: (
      <Stack>
        <Text sx={{ whiteSpace: "pre-line" }}>
          {t("index.uploadTitleTooltip")}
        </Text>
      </Stack>
    ),
  });
};

export default showUploadInfoModal;

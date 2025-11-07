import {
  ActionIcon,
  Box,
  Group,
  MediaQuery,
  Skeleton,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import moment from "moment";
import { TbLink, TbTrash, TbArticle } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import useConfig from "../../../hooks/config.hook";
import useTranslate from "../../../hooks/useTranslate.hook";
import { MyShare } from "../../../types/share.type";
import { byteToHumanSizeString } from "../../../utils/fileSize.util";
import toast from "../../../utils/toast.util";
import showShareLinkModal from "../../account/showShareLinkModal";
import {IoOpenOutline} from 'react-icons/io5';
import Link from 'next/link';

const ManageShareTable = ({
  shares,
  deleteShare,
  isLoading,
}: {
  shares: MyShare[];
  deleteShare: (share: MyShare) => void;
  isLoading: boolean;
}) => {
  const modals = useModals();
  const clipboard = useClipboard();
  const config = useConfig();
  const t = useTranslate();

  return (
    <Box sx={{ display: "block", overflowX: "auto" }}>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
              <th>
                <FormattedMessage id="account.shares.table.name" />
              </th>

              <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                  <th>
                      <FormattedMessage id="account.shares.table.description"/>
                  </th>
              </MediaQuery>

              <th>
                <FormattedMessage id="admin.shares.table.username" />
              </th>

              <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                  <th>
                      <FormattedMessage id="account.shares.table.visitors"/>
                  </th>
              </MediaQuery>

              <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                  <th>
                      <FormattedMessage id="account.shares.table.size"/>
                  </th>
              </MediaQuery>

              <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                  <th>
                      <FormattedMessage id="account.shares.table.createdAt"/>
                  </th>
              </MediaQuery>

              <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                  <th>
                      <FormattedMessage id="account.shares.table.expiresAt"/>
                  </th>
              </MediaQuery>

              <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                  <th style={{textAlign: 'center'}}>
                      <FormattedMessage id="account.shares.table.id"/>
                  </th>
              </MediaQuery>

              <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? skeletonRows
            : shares.map((share) => (
                <tr key={share.id}>
                  {/* Name (30 chars) */}
                  <td style={{ maxWidth: 200 }}>
                    {share.name ? (
                      <Text
                        size="sm"
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                          {share.name}
                      </Text>
                    ) : (
                      <Text color="dimmed">-</Text>
                    )}
                  </td>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>{/* Description (20 chars) */}
                        <td style={{maxWidth: 200}}>
                            {share.description ? (
                                <Text
                                    size="sm"
                                    sx={{overflow: 'hidden', textOverflow: 'ellipsis'}}
                                >
                                    {share.description.length > 20
                                        ? `${share.description.slice(0, 20)}...`
                                        : share.description}
                                </Text>
                            ) : (
                                <Text color="dimmed">Leer</Text>
                            )}
                        </td>
                    </MediaQuery>

                  {/* Creator / Reverse share name / Anonymous (30 chars) */}
                  <td style={{ maxWidth: 200}}>
                    {(() => {
                      const creatorLabel = share.creator
                        ? share.creator.username
                        : share.reverseShare?.name || 'Anonymous';
                      const isAnonymous = creatorLabel === 'Anonymous';
                      return (
                        <Text
                          size="sm"
                          color={isAnonymous ? 'dimmed' : undefined}
                          sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                            {creatorLabel}
                        </Text>
                      );
                    })()}
                  </td>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td style={{width: 60}}>{share.views}</td>
                    </MediaQuery>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td style={{width: 85}}>{byteToHumanSizeString(share.size)}</td>
                    </MediaQuery>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td style={{width: 140}}>
                            {moment(share.createdAt).format("DD.MM.YYYY, HH:mm")}
                        </td>
                    </MediaQuery>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td style={{width: 140}}>
                            {moment(share.expiration).unix() === 0
                                ? "Never"
                                : moment(share.expiration).format("DD.MM.YYYY, HH:mm")}
                        </td>
                    </MediaQuery>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td style={{width: 45, textAlign: 'center'}}>
                            <Tooltip label={`ID: ${share.id}`} position="bottom" withinPortal>
                                <ActionIcon
                                    variant="light"
                                    size={25}
                                    onClick={() => {
                                        clipboard.copy(share.id);
                                        toast.success(t("common.notify.copied-id"));
                                    }}
                                    aria-label={`Copy ID ${share.id}`}
                                >
                                    <TbArticle/>
                                </ActionIcon>
                            </Tooltip>
                        </td>
                    </MediaQuery>

                  <td style={{ minWidth: 125 }}>
                    <Group position="right">
                      <ActionIcon
                        color="orange"
                        variant="light"
                        size={25}
                        onClick={() => {
                          const url = `${window.location.origin}/share/${share.id}`;
                          // open in new tab
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        <IoOpenOutline />
                      </ActionIcon>
                      <ActionIcon
                        color="victoria"
                        variant="light"
                        size={25}
                        onClick={() => {
                          if (window.isSecureContext) {
                            clipboard.copy(
                              `${window.location.origin}/s/${share.id}`,
                            );
                            toast.success(t("common.notify.copied-link"));
                          } else {
                            showShareLinkModal(modals, share.id);
                          }
                        }}
                      >
                        <TbLink />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => deleteShare(share)}
                      >
                        <TbTrash />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </Box>
  );
};

const skeletonRows = [...Array(10)].map((v, i) => (
  <tr key={i}>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <MediaQuery smallerThan="md" styles={{ display: "none" }}>
      <td>
        <Skeleton key={i} height={20} />
      </td>
    </MediaQuery>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <td>
      <Skeleton key={i} height={20} />
    </td>
  </tr>
));

export default ManageShareTable;

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
  <Table verticalSpacing="sm" sx={{ 'td': { verticalAlign: 'top' } }}>
        <thead>
          <tr>
            <th style={{width: 230}}>
              <FormattedMessage id="account.shares.table.name"/>
            </th>

            <MediaQuery smallerThan="xs" styles={{display: "none"}}>
              <th style={{width: 180}}>
                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                  <span><FormattedMessage id="account.shares.table.description" /></span>
                </MediaQuery>
                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                  <span><FormattedMessage id="account.shares.table.description.short" /></span>
                </MediaQuery>
              </th>
            </MediaQuery>

            <th style={{width: 230}}>
              <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                <span><FormattedMessage id="admin.shares.table.username" /></span>
              </MediaQuery>
              <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                <span><FormattedMessage id="admin.shares.table.username.short" /></span>
              </MediaQuery>
            </th>

            <MediaQuery smallerThan="xs" styles={{display: "none"}}>
              <th style={{width: 60}}>
                <FormattedMessage id="account.shares.table.visitors"/>
              </th>
            </MediaQuery>

            <MediaQuery smallerThan="xs" styles={{display: "none"}}>
              <th style={{width: 85}}>
                <FormattedMessage id="account.shares.table.size"/>
              </th>
            </MediaQuery>

            <MediaQuery smallerThan="xs" styles={{display: "none"}}>
              <th style={{width: 150}}>
                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                  <span><FormattedMessage id="account.shares.table.createdAt" /></span>
                </MediaQuery>
                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                  <span><FormattedMessage id="account.shares.table.createdAt.short" /></span>
                </MediaQuery>
              </th>
            </MediaQuery>

            <MediaQuery smallerThan="xs" styles={{display: "none"}}>
              <th style={{width: 150}}>
                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                  <span><FormattedMessage id="account.shares.table.expiresAt" /></span>
                </MediaQuery>
                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                  <span><FormattedMessage id="account.shares.table.expiresAt.short" /></span>
                </MediaQuery>
              </th>
            </MediaQuery>

            <MediaQuery smallerThan="xs" styles={{display: "none"}}>
              <th style={{minWidth: 45, textAlign: 'center'}}>
                <FormattedMessage id="account.shares.table.id"/>
              </th>
            </MediaQuery>

            <th style={{minWidth: 125}}></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? skeletonRows
            : shares.map((share) => (
                <tr key={share.id}>
                  {/* Name (30 chars) */}
                    <td>
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
                        <td>
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
                    <td>
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
                        <td>
                            {share.views}
                        </td>
                    </MediaQuery>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td>
                            {byteToHumanSizeString(share.size)}
                        </td>
                    </MediaQuery>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td>
                            {moment(share.createdAt).format("DD.MM.YYYY, HH:mm")}
                        </td>
                    </MediaQuery>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td>
                            {moment(share.expiration).unix() === 0
                                ? "Never"
                                : moment(share.expiration).format("DD.MM.YYYY, HH:mm")}
                        </td>
                    </MediaQuery>

                    <MediaQuery smallerThan="xs" styles={{display: "none"}}>
                        <td style={{textAlign: 'center'}}>
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

                    <td>
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

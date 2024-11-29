import {
    ActionIcon,
    Box,
    Button,
    Center,
    Group,
    Space,
    Stack,
    Table,
    Text,
    Title,
} from "@mantine/core";
import { useClipboard, useMediaQuery } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbEdit, TbInfoCircle, TbLink, TbTrash } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import Meta from "../../components/Meta";
import showShareInformationsModal from "../../components/account/showShareInformationsModal";
import showShareLinkModal from "../../components/account/showShareLinkModal";
import CenterLoader from "../../components/core/CenterLoader";
import useConfig from "../../hooks/config.hook";
import useTranslate from "../../hooks/useTranslate.hook";
import shareService from "../../services/share.service";
import { MyShare } from "../../types/share.type";
import toast from "../../utils/toast.util";
import { Collapse } from "@mantine/core";
import React from "react";
import EditShare from "../share/[shareId]/edit";
import ShowShare from "../share/[shareId]/index";
import { TbChevronDown, TbChevronRight } from "react-icons/tb";
import { Switch } from "@mantine/core";
import { Transition} from "@mantine/core";

// Move the useState hook inside the MyShares component
const MyShares = () => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const isSmallScreen = useMediaQuery("(max-width: 1000px");

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const modals = useModals();
    const clipboard = useClipboard();
    const config = useConfig();
    const t = useTranslate();

    const [shares, setShares] = useState<MyShare[]>();

    const [isEditMode, setIsEditMode] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const toggleEditMode = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsEditMode(!isEditMode);
            setIsTransitioning(false);
        }, 265); // Duration of the transition
    };

    useEffect(() => {
        shareService.getMyShares().then((shares) => setShares(shares));
    }, []);

    if (!shares) return <CenterLoader />;

    return (
        <>
            <Meta title={t("account.shares.title")} />
            {/*<Title mb={30} order={3}>*/}
            {/*  <FormattedMessage id="account.shares.title" />*/}
            {/*</Title>*/}
            {shares.length == 0 ? (
                <Center style={{ height: "70vh" }}>
                    <Stack align="center" spacing={10}>
                        <Title order={3}>
                            <FormattedMessage id="account.shares.title.empty" />
                        </Title>
                        <Text>
                            <FormattedMessage id="account.shares.description.empty" />
                        </Text>
                        <Space h={5} />
                        {/*<Button component={Link} href="/upload" variant="light">*/}
                        {/*    <FormattedMessage id="account.shares.button.create" />*/}
                        {/*</Button>*/}
                    </Stack>
                </Center>
            ) : (
                <Box sx={{ display: "block", overflowX: "auto" }}>
                    <Table>
                        <thead>
                        <tr>
                            <th style={{ width: "25px" }}>
                                {/* Add an empty header for the collapse icon */}
                            </th>
                            <th style={{ width: "200px" }}>
                                <FormattedMessage id="account.shares.table.name"/>
                            </th>
                            <th style={{ width: "25px" }}>
                                <FormattedMessage id="account.shares.table.amount" />
                            </th>
                            <th style={{ width: "150px", display: isSmallScreen ? "none" : "" }}>
                                <FormattedMessage id="account.shares.table.id" />
                            </th>
                            <th style={{ width: "25px", display: isSmallScreen ? "none" : "" }}>
                                <FormattedMessage id="account.shares.table.visitors" />
                            </th>
                            <th style={{ width: "150px" }}>
                                <FormattedMessage id="account.shares.table.expiresAt" />
                            </th>
                            <th style={{ width: "150px" }}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {shares.map((share) => (
                            <React.Fragment key={share.id}>
                                <tr onClick={() => toggleRow(share.id)}>
                                    <td>
                                        {expandedRow === share.id ? <TbChevronDown /> : <TbChevronRight />}
                                    </td>
                                    <td style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {share.name}
                                    </td>
                                    <td>{share.files.length}</td>
                                    <td style={{ display: isSmallScreen ? "none" : "" }}>{share.id}</td>
                                    <td style={{ display: isSmallScreen ? "none" : "" }}>{share.views}</td>
                                    <td>
                                        {moment(share.expiration).unix() === 0
                                            ? "Never"
                                            : moment(share.expiration).format("LLL")}
                                    </td>
                                    <td>
                                        <Group position="right">
                                            <Link href={`/share/${share.id}/edit`}>
                                                <ActionIcon color="orange" variant="light" size={25}>
                                                    <TbEdit />
                                                </ActionIcon>
                                            </Link>
                                            <ActionIcon
                                                color="blue"
                                                variant="light"
                                                size={25}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    showShareInformationsModal(
                                                        modals,
                                                        share,
                                                        parseInt(config.get("share.maxSize")),
                                                        config.get("general.appUrl"),
                                                    );
                                                }}
                                            >
                                                <TbInfoCircle />
                                            </ActionIcon>
                                            <ActionIcon
                                                color="victoria"
                                                variant="light"
                                                size={25}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    if (window.isSecureContext) {
                                                        clipboard.copy(
                                                            `${config.get("general.appUrl")}/s/${share.id}`,
                                                        );
                                                        toast.success(t("common.notify.copied"));
                                                    } else {
                                                        showShareLinkModal(modals, share.id, config.get("general.appUrl"),);
                                                    }
                                                }}
                                            >
                                                <TbLink />
                                            </ActionIcon>
                                            <ActionIcon
                                                color="red"
                                                variant="light"
                                                size={25}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    modals.openConfirmModal({
                                                        title: t("account.shares.modal.delete.title", {
                                                            share: share.description,
                                                        }),
                                                        children: (
                                                            <Text size="sm">
                                                                <FormattedMessage id="account.shares.modal.delete.description" />
                                                            </Text>
                                                        ),
                                                        confirmProps: {
                                                            color: "red",
                                                        },
                                                        labels: {
                                                            confirm: t("common.button.delete"),
                                                            cancel: t("common.button.cancel"),
                                                        },
                                                        onConfirm: () => {
                                                            shareService.remove(share.id);
                                                            setShares(shares.filter((item) => item.id !== share.id));
                                                        },
                                                    });
                                                }}
                                            >
                                                <TbTrash />
                                            </ActionIcon>
                                        </Group>
                                    </td>
                                </tr>
                                <tr style={{ border: "none" }}>
                                    <td colSpan={7} style={{ border: "none", padding: 0 }}>
                                        <Collapse in={expandedRow === share.id}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    flexWrap: "wrap",
                                                    width: "100%",
                                                }}
                                            >
                                                <Switch
                                                    checked={isEditMode}
                                                    onChange={toggleEditMode}
                                                    // label={isEditMode ? t("account.shares.switch.show") : t("account.shares.switch.edit")}
                                                    label={t("account.shares.switch.edit")}
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "flex-start",
                                                        marginBottom: "20px",
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        marginTop: "20px",
                                                        marginBottom: "40px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        flexDirection: "column",
                                                        width: isSmallScreen ? "100%" : "90%",
                                                    }}
                                                >
                                                    <Transition
                                                        mounted={isEditMode && !isTransitioning}
                                                        transition="fade"
                                                        duration={300}
                                                        timingFunction="ease"
                                                    >
                                                        {(styles) => (
                                                            <div style={styles}>
                                                                <EditShare shareId={share.id} />
                                                            </div>
                                                        )}
                                                    </Transition>
                                                    <Transition
                                                        mounted={!isEditMode && !isTransitioning}
                                                        transition="fade"
                                                        duration={300}
                                                        timingFunction="ease"
                                                    >
                                                        {(styles) => (
                                                            <div style={styles}>
                                                                <ShowShare shareId={share.id} />
                                                            </div>
                                                        )}
                                                    </Transition>
                                                </div>
                                            </div>
                                        </Collapse>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                        </tbody>
                    </Table>
                </Box>
            )}
        </>
    );
};

export default MyShares;

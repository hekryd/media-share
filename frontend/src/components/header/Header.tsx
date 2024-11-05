import {
  Box,
  Burger,
  Container,
  Group,
  Header as MantineHeader,
  Paper,
  Stack,
  Transition,
  createStyles,
  ActionIcon,
} from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";

import ActionAvatar from "./ActionAvatar";
import Link from "next/link";
import Logo from "../Logo";
import NavbarShareMenu from "./NavbarShareMenu";
import useConfig from "../../hooks/config.hook";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import useTranslate from "../../hooks/useTranslate.hook";
import useUser from "../../hooks/user.hook";
import {TbArrowLoopLeft, TbLink} from "react-icons/tb";

const HEADER_HEIGHT = 50;

type NavLink = {
  link?: string;
  icon?: ReactNode;
  label?: string;
  component?: ReactNode;
  action?: () => Promise<void>;
};

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
    border:"none !important",
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",
    display: "flex",
    justifyContent: "flex-end",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex !important",
    justifyContent: "flex-end !important",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : "#7f7f7f",
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },

  linkContent: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.xs, // Add some space between the icon and the label
    display: 'flex',
    alignItems: 'center',
  },
}));

const Header = () => {
  const { user } = useUser();
  const router = useRouter();
  const config = useConfig();
  const t = useTranslate();

  const [opened, toggleOpened] = useDisclosure(false);

  const [currentRoute, setCurrentRoute] = useState("");

  useEffect(() => {
    setCurrentRoute(router.pathname);
  }, [router.pathname]);

  const authenticatedLinks: NavLink[] = [
    {
      link: "/upload",
      icon: <TbLink />,
      label: t("navbar.links.shares"),
    },
    {
      link: "/account/reverseShares",
      icon: <TbArrowLoopLeft />,
      label: t("navbar.links.reverse"),
    },
    {
      component: <ActionAvatar />,
    }
  ];

  let unauthenticatedLinks: NavLink[] = [
    // {
    //   link: "/auth/signIn",
    //   label: t("navbar.signin"),
    // }
  ];

  if (config.get("share.allowUnauthenticatedShares")) {
    unauthenticatedLinks.unshift({
      link: "/upload",
      label: t("navbar.upload"),
    });
  }

  if (config.get("general.showHomePage"))
    unauthenticatedLinks.unshift({
      link: "/",
      label: t("navbar.home"),
    });

  if (config.get("share.allowRegistration"))
    unauthenticatedLinks.push({
      link: "/auth/signUp",
      label: t("navbar.signup"),
    });

  const { classes, cx } = useStyles();
  const items = (
    <>
      {(user ? authenticatedLinks : unauthenticatedLinks).map((link, i) => {
        if (link.component) {
          return (
            <Box pl={5} py={15} key={i}>
              {link.component}
            </Box>
          );
        }
        return (
            <Link
                key={link.label}
                href={link.link ?? ""}
                onClick={() => toggleOpened.toggle()}
                className={cx(classes.link, {
                  [classes.linkActive]: currentRoute == link.link,
                })}
            >
              <span className={classes.linkContent}>
                {link.icon && <span className={classes.icon}>{link.icon}</span>}
                {link.label}
              </span>
            </Link>
      );
      })}
      </>
      )
        ;
        return (
    <MantineHeader height={HEADER_HEIGHT} mb={20} className={classes.root}>
      <Container className={classes.header}>

        <Group spacing={5} className={classes.links}>
          <Group>{items} </Group>
        </Group>

        <Burger
          opened={opened}
          onClick={() => toggleOpened.toggle()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              <Stack spacing={0}> {items}</Stack>
            </Paper>
          )}
        </Transition>
      </Container>
    </MantineHeader>
  );
};

export default Header;

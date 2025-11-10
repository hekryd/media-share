import {ActionIcon, Avatar, Group, Menu, Text} from "@mantine/core";
import Link from "next/link";
import { TbDoorExit, TbSettings, TbUser } from "react-icons/tb";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import { FormattedMessage, useIntl } from "react-intl";

const ActionAvatar = () => {
  const { user } = useUser();
  if (!user) return null;

  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <Group>
          <ActionIcon style={{ backgroundColor: "#f8f9fa", borderRadius: "0.25rem", width: "auto", display: "flex" , alignItems: "flex-end"}}>
          <Avatar size={28}/>
          <Text mr={5}>
            {user.username ?? user.email ?? ""}
          </Text>
        </ActionIcon>
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/account" icon={<TbUser size={14} />}>
          <FormattedMessage id="navbar.avatar.account" />
        </Menu.Item>
        {user!.isAdmin && (
          <Menu.Item
            component={Link}
            href="/admin"
            icon={<TbSettings size={14} />}
          >
            <FormattedMessage id="navbar.avatar.admin" />
          </Menu.Item>
        )}

        <Menu.Item
          onClick={async () => {
            await authService.signOut();
          }}
          icon={<TbDoorExit size={14} />}
        >
          <FormattedMessage id="navbar.avatar.signout" />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionAvatar;

import React from "react";
import {Layout, Menu, Breadcrumb} from "antd";
import {mutable, asyncGen} from "react-async-generators";
import {MenuUnfoldOutlined, MenuFoldOutlined} from "@ant-design/icons";
import "./AppLayout.css";
import {getCurrentUser} from "../auth/store/Users";

const {Header, Sider, Content} = Layout;

interface AppLayoutProps {
	children?: React.ReactNode;
	menuItems: () => React.ReactNode[];
}

async function* AppLayout(
	{children, menuItems}: AppLayoutProps,
	refresh: () => void,
) {
	let collapsed = mutable<boolean>(false, refresh);

	const onClickToggle = () => {
		collapsed.set(!collapsed.get());
	};

	const currentUser = getCurrentUser(refresh);

	while (true) {
		const user = await currentUser.next();

		yield (
			<Layout
				id="components-layout-demo-custom-trigger"
				style={{height: "100vh"}}
			>
				<Sider trigger={null} collapsible collapsed={collapsed.get()}>
					<div className="logo" />
					<Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
						{menuItems()}
					</Menu>
				</Sider>
				<Layout
					className="site-layout"
					style={{
						maxHeight: "100vh",
						overflow: "hidden",
					}}
				>
					<Header className="site-layout-background" style={{padding: 0}}>
						{React.createElement(
							collapsed.get() ? MenuUnfoldOutlined : MenuFoldOutlined,
							{
								className: "trigger",
								onClick: onClickToggle,
							},
						)}
					</Header>
					<Content
						style={{
							margin: "0 16px",
							flex: 1,
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Breadcrumb style={{margin: "16px 0"}}>
							<Breadcrumb.Item>User</Breadcrumb.Item>
							<Breadcrumb.Item>
								{user?.value?.name ?? "Anonymous"}
							</Breadcrumb.Item>
						</Breadcrumb>
						<div
							className="site-layout-background"
							style={{
								padding: 24,
								minHeight: 360,
								flex: 1,
								marginBottom: "16px",
							}}
						>
							<div
								style={{
									overflow: "auto",
									height: "100%",
								}}
							>
								{children}
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
		);
	}
}

export default asyncGen(AppLayout);

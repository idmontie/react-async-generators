import React from "react";
// import {Layout} from "antd";
import {asyncGen} from "react-async-generators";

interface AppLayoutProps {
	children?: React.ReactNode;
}

function* AppLayout({children}: AppLayoutProps) {
	while (true) {
		yield <div>{children}</div>;
	}
}

export default asyncGen(AppLayout);

// import React from "react";
// import {Layout, Menu} from "antd";
// import {mutable, asyncGen} from "react-async-generators";
// import {
// 	MenuUnfoldOutlined,
// 	MenuFoldOutlined,
// 	UserOutlined,
// 	VideoCameraOutlined,
// 	UploadOutlined,
// } from "@ant-design/icons";

// const {Header, Sider, Content} = Layout;

// interface AppLayoutProps {
// 	children?: React.ReactNode;
// }

// function* AppLayout({children}: AppLayoutProps, refresh: () => void) {
// 	let collapsed = mutable<boolean>(false, refresh);

// 	const onClickToggle = () => {
// 		collapsed.set(!collapsed.get());
// 	};

// 	while (true) {
// 		yield (
// 			<Layout>
// 				<Sider trigger={null} collapsible collapsed={collapsed.get()}>
// 					<div className="logo" />
// 					<Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
// 						<Menu.Item key="1" icon={<UserOutlined />}>
// 							nav 1
// 						</Menu.Item>
// 						<Menu.Item key="2" icon={<VideoCameraOutlined />}>
// 							nav 2
// 						</Menu.Item>
// 						<Menu.Item key="3" icon={<UploadOutlined />}>
// 							nav 3
// 						</Menu.Item>
// 					</Menu>
// 				</Sider>
// 				<Layout className="site-layout">
// 					<Header className="site-layout-background" style={{padding: 0}}>
// 						{React.createElement(
// 							collapsed.get() ? MenuUnfoldOutlined : MenuFoldOutlined,
// 							{
// 								className: "trigger",
// 								onClick: onClickToggle,
// 							},
// 						)}
// 					</Header>
// 					<Content
// 						className="site-layout-background"
// 						style={{
// 							margin: "24px 16px",
// 							padding: 24,
// 							minHeight: 280,
// 						}}
// 					>
// 						{children}
// 					</Content>
// 				</Layout>
// 			</Layout>
// 		);
// 	}
// }

// export default asyncGen(AppLayout);

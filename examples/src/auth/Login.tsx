import React from "react";
import {asyncGen} from "react-async-generators";
import {Form, Input, Button} from "antd";
import {User} from "./types";

interface LoginProps {
	onLogin: (user: User) => void;
}

async function loginAsUser(username: string, _: string): Promise<User> {
	return new Promise<User>((resolve) => {
		setTimeout(() => {
			resolve({
				username,
				id: 1,
				name: "John Doe",
			});
		}, 1000);
	});
}

/**
 * Example of how setState would work
 */
async function* Login({onLogin}: LoginProps, refresh: () => void) {
	let loading = false;

	const onFinish = async (values: any) => {
		loading = true;
		refresh();

		try {
			const user = await loginAsUser(values.username, values.password);
			onLogin(user);
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
			refresh();
		}
	};

	while (true) {
		yield (
			<Form name="basic" initialValues={{}} onFinish={onFinish}>
				<Form.Item
					label="Username"
					name="username"
					rules={[{required: true, message: "Please input your username!"}]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[{required: true, message: "Please input your password!"}]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item wrapperCol={{offset: 8, span: 16}}>
					<Button type="primary" htmlType="submit" loading={loading}>
						Submit
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

export default asyncGen(Login);

import React from "react";
import {asyncGen, mutable} from "react-async-generators";
import {Form, Input, Button} from "antd";
import {User} from "./types";
import {loginAsUser} from "./store/Users";

interface LoginProps {
	onLogin?: (user: User) => void;
}

/**
 * Example of how setState would work
 */
async function* Login(
	{onLogin = (_: User) => {}}: LoginProps,
	refresh: () => void,
) {
	let loading = mutable<boolean>(false, refresh);

	const onFinish = async (values: any) => {
		loading.set(true);

		try {
			const user = await loginAsUser(values.username, values.password);
			onLogin(user);
		} catch (e) {
			console.error(e);
		} finally {
			loading.set(false);
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
					<Button type="primary" htmlType="submit" loading={loading.get()}>
						Submit
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

export default asyncGen(Login);

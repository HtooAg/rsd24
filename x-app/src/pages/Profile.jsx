import { Avatar, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

import { useAuth } from "../providers/AuthProvider";

import PostCard from "../components/PostCard";
import { blue, pink } from "@mui/material/colors";

import { useParams } from "react-router-dom";

export default function Profile() {
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const [photo, setPhoto] = useState("");
	const [cover, setCover] = useState("");

	const { authUser } = useAuth();
	const { id } = useParams();

	const like = (_id) => {
		const result = posts.map((post) => {
			if (post._id === _id) {
				post.likes.push(authUser._id);
			}

			return post;
		});

		setPosts(result);
	};

	const unlike = (_id) => {
		const result = posts.map((post) => {
			if (post._id === _id) {
				post.likes = post.likes.filter((like) => like !== authUser._id);
			}

			return post;
		});

		setPosts(result);
	};

	const getFile = async () => {
		const [fileHandle] = await window.showOpenFilePicker({
			types: [
				{
					description: "Images",
					accept: {
						"image/*": [".png", ".jpeg", ".jpg"],
					},
				},
			],
			excludeAcceptAllOption: true,
			multiple: false,
		});

		return await fileHandle.getFile();
	};

	const changePhoto = async (e) => {
		const file = await getFile();
		setPhoto(URL.createObjectURL(file));
	};

	useEffect(() => {
		(async () => {
			setIsLoading(true);

			const api = import.meta.env.VITE_API_URL;
			const res = await fetch(`${api}/posts/profile/${id}`);
			const data = await res.json();

			setPosts(data);
			setIsLoading(false);
		})();
	}, []);

	return (
		<Box>
			<Box
				sx={{
					background: blue[500],
					height: 200,
					borderRadius: 5,
					cursor: "pointer",
					overflow: "hidden",
				}}
				onClick={async () => {
					changeCover();
				}}
			>
				<img src={cover} width="100%" alt="" />
			</Box>
			<Box
				sx={{
					marginBottom: "-64px",
					marginBottom: "40px",
					textAlign: "center",
				}}
			>
				<Button
					onClick={async () => {
						changePhoto();
					}}
				>
					<Avatar
						src={photo}
						sx={{
							background: pink[500],
							height: 128,
							width: 128,
						}}
					>
						{authUser.name[0]}
					</Avatar>
				</Button>
			</Box>
			{isLoading ? (
				<Box>Loading...</Box>
			) : (
				posts.map((post) => (
					<PostCard
						key={post._id}
						post={post}
						like={like}
						unlike={unlike}
					/>
				))
			)}
		</Box>
	);
}

import { useContext } from "react";
import { DataContext } from "../Context"
import PostRender from "./PostRender";

import "./Post.css"
import "./Post-phone.css"

export default function PostsRender({
    posts=[],
    noSection // Передаем параметр для рендера без секции ниже
}) {
    const Context = useContext(DataContext)

    return (
        <>
            {posts.map((post) => {
                let postAuthor = Context.users.find(user => user.country_id === post.country_id)

                // Если автор не найден - не возвращаем
                if (postAuthor) {
                    return (
                        <PostRender
                            key={post.post_id}
                            post={post}
                            postAuthor={postAuthor}
                            noSection={noSection}
                        />
                    )
                }

                return null
            })}
        </>
    )
}
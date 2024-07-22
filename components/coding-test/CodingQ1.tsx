import React from 'react'
import { Text, View } from '../Themed'
import { Users } from './testcases/users'
import { Posts } from './testcases/posts'
import { Comments } from './testcases/comments'
import { Likes } from './testcases/likes'

const CodingQ1 = () => {
    // Posts, Comments, Users, Likes
    return (
        <View>
            <Text>Coding Round 1 - Post Output creation - Merge Comments and Likes in a Post Object</Text>
            <Text>1. Show me recent 10 posts with the user info for each</Text>
            <Text>2. Append top 2 comments</Text>
            <Text>3. Append top 4 likes</Text>
        </View>
    )
}

export default CodingQ1
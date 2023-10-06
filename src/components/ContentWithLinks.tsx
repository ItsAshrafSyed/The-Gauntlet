import React from "react";
import { Text } from "@chakra-ui/react";

type ContentWithLinksProps = {
	content: string;
};

function ContentWithLinks({ content: content }: ContentWithLinksProps) {
	// Split the content into parts based on links (assuming links are URLs)
	const parts = content.split(/(https?:\/\/[^\s]+)/);

	return (
		<Text
			fontSize={["10", "10", "20", "20"]}
			fontWeight={"300"}
			textColor={"#AAABAE)"}
			style={{ whiteSpace: "pre-wrap" }}
		>
			{parts.map((part, index) => {
				// Check if the part is a link (it starts with http or https)
				if (part.match(/https?:\/\/[^\s]+/)) {
					return (
						<a
							key={index}
							href={part}
							target="_blank"
							rel="noopener noreferrer"
							style={{ color: "#FF9728" }}
						>
							{part}
						</a>
					);
				}

				// If not a link, render it as plain text
				return part;
			})}
		</Text>
	);
}

export default ContentWithLinks;

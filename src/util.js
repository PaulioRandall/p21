export const cleanNodes = () => {
	// TODO: Detect node type and parse accordingly
	// HTML block: <!--
	// JS block: /*
	// JS line: //
}

export const cleanHtmlBlockNode = () => {}

export const cleanJsBlockNode = () => {}

export const cleanJsLineNode = () => {}

export default {
	cleanNodes,
	cleanHtmlBlockNode,
	cleanJsBlockNode,
	cleanJsLineNode,
}

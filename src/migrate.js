// from https://github.com/react-page/react-page/blob/b09b551d1469ad0db4c2ef9a299be886251c554a/packages/plugins/content/slate/src/migrations/v004.ts

const { isEmpty } = require('lodash');

const migrateTextNode = oldNode => {
  return {
    text: oldNode.text,
    ...(oldNode.marks?.reduce(
      (acc, mark) => ({
        ...acc,
        [mark.type]: !isEmpty(mark.data) ? mark.data : true,
      }),
      {}
    ) ?? {})
  };
};

const migrateElementNode = node => {
	return {
		data: node.data ?? {},
		type: node.type,
		children: node.nodes?.map(migrateNode).flat() ?? [],
	};
};

const migrateNode = oldNode => {
	if (oldNode.object === 'text') {
		return migrateTextNode(oldNode);
	} else {
		return migrateElementNode(oldNode);
	}
};

module.exports = {
  migrate: oldData => {
    return oldData.document.nodes.map(migrateNode);
  }
};

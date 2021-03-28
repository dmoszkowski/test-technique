import { useContext } from 'react';
import SSRVarsContainerContext from '/src/contexts/SSRVarsContainerContext';

export default (varName, defaultVal, onlyOnce = false) => {
	const ssrVarsContainer = useContext(SSRVarsContainerContext);
	if (varName in ssrVarsContainer) {
		const varVal = ssrVarsContainer[varName];
		if (onlyOnce && (typeof(window) !== undefined)) {
			delete(ssrVarsContainer[varName]);
		}
		return varVal;
	} else {
		return defaultVal;
	}
};

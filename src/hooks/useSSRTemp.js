import { useState, useEffect } from 'react';
import useSSRVar from '/src/hooks/useSSRVar';

export default (varName, defaultVal, effectDependancies) => {
	const ssrVar = useSSRVar(varName, defaultVal, true);
	const [value, setValue] = useState(ssrVar);
	const [firstUpdate, setFirstUpdate] = useState(true);
	if (Array.isArray(effectDependancies)) {
		effectDependancies.push(value);
	}
	useEffect(()=>{
		if (firstUpdate) {
			setFirstUpdate(false);
		} else {
			setValue(defaultVal);
		}
	},effectDependancies);
	return value;
};

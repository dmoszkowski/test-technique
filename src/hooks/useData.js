import { useState, useEffect } from 'react';
import useSSRVar from '/src/hooks/useSSRVar';

export default (dataLoaderName, defaultValue) => {
	const preloadedVal = useSSRVar(`loadedData/${dataLoaderName}`, defaultValue);
	const loadAsync = (preloadedVal === defaultValue);
	let [data, setData] = useState(preloadedVal);
	useEffect(()=>{
		if (loadAsync && (typeof(window) !== undefined)) {
			fetch(`/ajax/${dataLoaderName}`)
				.then(response => response.json())
				.then(loadedData=>setData(loadedData));
		}
	}, [dataLoaderName,loadAsync]);
	return data;
};

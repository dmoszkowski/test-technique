import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '/src/App';
import { StaticRouter } from 'react-router-dom';
import serialize from "serialize-javascript";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
	return assets[entrypoint] ? assets[entrypoint].css ?
	assets[entrypoint].css.map(asset=>
		`<link rel="stylesheet" href="${asset}">`
	).join('') : '' : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
	return assets[entrypoint] ? assets[entrypoint].js ?
	assets[entrypoint].js.map(asset=>
		`<script src="${asset}"${extra}></script>`
	).join('') : '' : '';
};

export default async (req, res) => {
	const context = {};
	req.locals.exportVars.userIsLogged = !!req.user;
	const markup = renderToString(
		<StaticRouter context={context} location={req.url}>
			<App ssrVarsContainer={req.locals.exportVars} />
		</StaticRouter>
	);

	if (context.url) {
		res.redirect(context.url);
	} else {
		let status = context.status || 200;
		let inlineVarsTag = "";
		if (req.locals && req.locals.exportVars) {
			inlineVarsTag += `window._SSRVars=${serialize(req.locals.exportVars)};`;
		}
		inlineVarsTag = `<script>${inlineVarsTag}</script>`;
		res.status(status).send(
			`<!doctype html>
				<html lang="">
				<head>
					<meta http-equiv="X-UA-Compatible" content="IE=edge" />
					<meta charset="utf-8" />
					<title>Test technique</title>
					<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width">
					${cssLinksFromAssets(assets, 'client')}
					${inlineVarsTag}
				</head>
				<body>
					<div id="root">${markup}</div>
					${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
				</body>
			</html>`
		);
	}
};

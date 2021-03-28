import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSSRVar from '/src/hooks/useSSRVar';
import clsx from 'clsx';

function NavBar() {
	const [menuActive, setMenuActive] = useState(false);
	const userIsLogged = useSSRVar('userIsLogged');
	function toggleActive() {
		setMenuActive(!menuActive);
	}
	return (
		<nav className="navbar is-info" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<div className="navbar-item">
					<h1 className="title is-4" style={{color:"inherit"}}>
						Test technique
					</h1>
				</div>

				<a className={clsx("navbar-burger", menuActive && "is-active")} onClick={()=>toggleActive()} role="button" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>

			<div className={clsx("navbar-menu", menuActive && "is-active")}>
				<div className="navbar-start">
					<Link to="/" className="navbar-item">
						Home
					</Link>
				</div>

				<div className="navbar-end">
					<div className="navbar-item">
						<div className="buttons">
							{(!userIsLogged) &&
								<>
									<Link to="/register" className="button is-primary">
										<strong>Sign up</strong>
									</Link>
									<Link to="/login" className="button is-light">
										Log in
									</Link>
								</>
							}
							{userIsLogged &&
								<a href="/logout" className="button is-danger">
									Log out
								</a>
							}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default NavBar;

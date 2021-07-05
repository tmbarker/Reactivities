import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

export default function NavBar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src="/assets/logo.png" alt="logo"  style={{marginRight: '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' header name='Activities'/>
                <Menu.Item as={NavLink} to='/errors' header name='Errors'/>
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}
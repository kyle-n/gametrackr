import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Drawer, IconButton, List, Divider, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {
  Menu as MenuIcon,
} from '@material-ui/icons';
import {Link} from 'react-router-dom';

export class MobileNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false}
    this.routes = MobileNav.getRoutesForLoginStatus(props.routes, false);
  }

  static getRoutesForLoginStatus = (routes, loggedIn) => {
    return routes.filter(route => route.showOnlyWhenLoggedIn === loggedIn);
  };

  toggleDrawer = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div onClick={this.toggleDrawer}>
        <DrawerButton toggleDrawer={this.toggleDrawer}/>
        <SideDrawerContainer
          open={this.state.open}
          routes={this.routes}
        />
      </div>
    );
  }
}

const SideDrawerLink = props => (
  <Link to={props.route.path}>
    <ListItem>
      <ListItemIcon>{props.route.icon}</ListItemIcon>
      <ListItemText>{props.route.title}</ListItemText>
    </ListItem>
  </Link>
);

const SideDrawerContainer = props => {
  const navLinks = props.routes.map(route => {
    return (
      <SideDrawerLink key={route.path} route={route}/>
    );
  });
  return (
    <Drawer anchor="left" open={props.open}>
      <List>
        {navLinks}
      </List>
    </Drawer>
  );
};

const DrawerButton = props => (
  <IconButton onClick={props.toggleDrawer}>
    <MenuIcon />
  </IconButton>
);

// const useStyles = makeStyles({
//   list: {
//     width: 250,
//   },
//   fullList: {
//     width: 'auto',
//   },
// });
//
// export function TemporaryDrawer() {
//   const classes = useStyles();
//   const [state, setState] = React.useState({
//     top: false,
//     left: false,
//     bottom: false,
//     right: false,
//   });
//
//   const toggleDrawer = (side, open) => event => {
//     if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
//       return;
//     }
//
//     setState({ ...state, [side]: open });
//   };
//
//   const sideList = side => (
//     <div
//       className={classes.list}
//       role="presentation"
//       onClick={toggleDrawer(side, false)}
//       onKeyDown={toggleDrawer(side, false)}
//     >
//       <List>
//         {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         {['All mail', 'Trash', 'Spam'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );
//
//   const fullList = side => (
//     <div
//       className={classes.fullList}
//       role="presentation"
//       onClick={toggleDrawer(side, false)}
//       onKeyDown={toggleDrawer(side, false)}
//     >
//       <List>
//         {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         {['All mail', 'Trash', 'Spam'].map((text, index) => (
//           <ListItem button key={text}>
//             <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );
//
//   return (
//     <div>
//       <Button onClick={toggleDrawer('left', true)}>Open Left</Button>
//       <Button onClick={toggleDrawer('right', true)}>Open Right</Button>
//       <Button onClick={toggleDrawer('top', true)}>Open Top</Button>
//       <Button onClick={toggleDrawer('bottom', true)}>Open Bottom</Button>
//       <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
//         {sideList('left')}
//       </Drawer>
//       <Drawer anchor="top" open={state.top} onClose={toggleDrawer('top', false)}>
//         {fullList('top')}
//       </Drawer>
//       <Drawer anchor="bottom" open={state.bottom} onClose={toggleDrawer('bottom', false)}>
//         {fullList('bottom')}
//       </Drawer>
//       <Drawer anchor="right" open={state.right} onClose={toggleDrawer('right', false)}>
//         {sideList('right')}
//       </Drawer>
//     </div>
//   );
// }

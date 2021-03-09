import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const modes = [
    {
        id: 'geographic',
        name: 'Geographic',
        description: 'Follow the target keeping the same vector while looking at the target'
    }, 
    {
        id: 'relative',
        name: 'Relative',
        description: '(WiP) Follow the target keeping the same orientation to its direction'
    },
    {
        id: 'bezier',
        name: 'Bezier',
        description: '(WiP) Follow a Bezier Curve at constant velocity'
    },
    {
        id: 'dynamic_bezier',
        name: 'Dynamic Bezier',
        description: '(WiP)'
    }
];

export default function FollowerModeSelector(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="follower-mode-selector-dialog-title" open={open}>
      <DialogTitle id="follower-mode-selector-dialog-title">Select Follower Mode</DialogTitle>
      <List>
        {modes.map((mode) => (
          <ListItem button onClick={() => handleListItemClick(mode.id)} key={mode.id}>
            <ListItemText primary={mode.name} secondary={mode.description}/>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

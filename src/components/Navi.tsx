import React, { useReducer, useContext } from "react";
import { Icon, Menu, MenuItemProps } from "semantic-ui-react";
import reducer, { initialState, LayerAction } from "../domains/Layer/reducer";
import { actionItem, actionItems } from "../domains/Layer/model";
import CanvasContext from "./context";
import { Button } from "semantic-ui-react";

export function Navi() {
  //const [state, dispatch] = useReducer(reducer, initialState);
  const [state, dispatch] = useContext(CanvasContext);

  const handleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps
  ) => {
    data.name && dispatch(LayerAction.select(data.name as actionItem));
  };

  const handleUndo = () => {
    dispatch(LayerAction.undo());
  };

  const handleRedo = () => {
    dispatch(LayerAction.redo());
  };

  return (
    <div
      className="menu"
      style={{
        position: "fixed",
        left: 0,
        top: "20%",
      }}
    >
      <Button attached="left" icon="undo" onClick={handleUndo} />
      <Button attached="right" icon="redo" onClick={handleRedo} />
      <Menu icon vertical>
        <Menu.Item
          name={actionItems.ARROW}
          active={state.activeItem === actionItems.ARROW}
          onClick={handleItemClick}
        >
          <Icon name={actionItems.ARROW} size="large" />
        </Menu.Item>
        <Menu.Item
          name={actionItems.TEXT}
          active={state.activeItem === actionItems.TEXT}
          onClick={handleItemClick}
        >
          <Icon name={actionItems.TEXT} size="large" />
        </Menu.Item>
        <Menu.Item
          name={actionItems.RECT}
          active={state.activeItem === actionItems.RECT}
          onClick={handleItemClick}
        >
          <Icon name={actionItems.RECT} size="large" />
        </Menu.Item>
        <Menu.Item
          name={actionItems.COLOR}
          active={state.activeItem === actionItems.COLOR}
          onClick={handleItemClick}
        >
          <Icon name={actionItems.COLOR} size="large" />
        </Menu.Item>
      </Menu>
    </div>
  );
}

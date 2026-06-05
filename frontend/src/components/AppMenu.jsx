import { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import {
  AiOutlineFundProjectionScreen,
  AiOutlineStock,
  AiOutlineRobot,
  AiOutlineSliders,
} from "react-icons/ai";
import { Link } from "react-router-dom";

const triggerAreaStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "50px",
  height: "100%",
  zIndex: 1000,
  cursor: "pointer",
};

export default function AppMenu() {
  const [isDashboardDrawerOpen, setIsDashboardDrawerOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => setIsDashboardDrawerOpen(true), 20);
    setHoverTimeout(timeout);
  };
  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => setIsDashboardDrawerOpen(false), 150);
    setHoverTimeout(timeout);
  };
  return (
    <>
      <div
        style={triggerAreaStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Button
        color="purple"
        variant="solid"
        onClick={() => setIsDashboardDrawerOpen(true)}
      >
        <span className="text-xl font-display flex ">Menu</span>
      </Button>
      <Drawer
        className="font-display text-xl "
        width={300}
        title="Menu"
        onClose={() => setIsDashboardDrawerOpen(false)}
        open={isDashboardDrawerOpen}
        placement={placement}
        key={placement}
        destroyOnClose
        onMouseEnter={() => {
          if (hoverTimeout) clearTimeout(hoverTimeout);
        }}
        onMouseLeave={() => {
          const timeout = setTimeout(
            () => setIsDashboardDrawerOpen(false),
            300
          );
          setHoverTimeout(timeout);
        }}
      >
        <h3 className="text-2xl m-10 !font-display">
          <Link to="/dashboard" className="flex flex-row items-center gap-3">
            <AiOutlineFundProjectionScreen />
            Dashboard
          </Link>
        </h3>
        <h3 className="text-2xl m-10 !font-display ">
          <Link to="/portfolio" className="flex flex-row items-center gap-3">
            <AiOutlineStock />
            Portfolio
          </Link>
        </h3>

        <h3 className="text-2xl m-10 !font-display">
          <Link to="/aiagent" className="flex flex-row items-center gap-3">
            <AiOutlineRobot />
            Ai Agents
          </Link>
        </h3>
      </Drawer>
    </>
  );
}

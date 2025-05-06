import { Squash as Hamburger } from "hamburger-react";
import { Dispatch, SetStateAction } from "react";

interface HamburgerMenuProp {
  toggled: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  size?: number;
  direction?: "left" | "right" | undefined;
  distance?: "sm" | "md" | "lg" | undefined;
  color?: string;
  easing?: string;
  onToggle?: () => void;
  rounded?: boolean;
  hideOutline?: boolean;
}

/**
 * custom Hamburger menu
 *
 * @export
 * @param {HamburgerMenuProp} {
 *   toggle,
 *   toggled,
 *   size,
 *   color,
 *   rounded,
 *   direction,
 *   distance,
 * }
 */
export default function HamburgerMenu({
  toggle,
  toggled,
  size,
  color,
  rounded,
  direction,
  distance,
}: HamburgerMenuProp) {
  return (
    <Hamburger
      toggled={toggled}
      toggle={toggle}
      size={size}
      color={color}
      rounded={rounded}
      direction={direction}
      distance={distance}
    />
  );
}

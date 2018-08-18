import * as React from "react";
import { NavigationState } from "../Interfaces";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

class NavigationBar extends React.Component<{}, NavigationState> {
  constructor(props) {
    super(props);
    
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  public render() {
    return (
      <div>
        <Navbar color="light" light={true} expand="md">
          <NavbarBrand href="/">PoeSearch</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar={true}>
            <Nav className="ml-auto" navbar={true}>
              <NavItem>
                <NavLink href="https://github.com/ashwinath/poe-search-discord">GitHub</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  private toggle() {
    this.setState(() => {
      return {
        ...this.state,
        isOpen: !this.state.isOpen,
      }
    });
  }
}

export default NavigationBar;

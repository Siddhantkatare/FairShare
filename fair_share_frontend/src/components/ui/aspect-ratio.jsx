import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import * as React from "react";

class AspectRatio extends React.Component {
  render() {
    return <AspectRatioPrimitive.Root {...this.props} />;
  }
}

export { AspectRatio };
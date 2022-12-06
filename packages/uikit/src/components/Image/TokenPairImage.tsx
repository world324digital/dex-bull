import React from "react";
import { TokenPairImageProps, variants } from "./types";
import { StyledPrimaryImage, StyledSecondaryImage } from "./styles";
import Wrapper from "./Wrapper";

const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primarySrc,
  secondarySrc,
  width,
  height,
  variant = variants.DEFAULT,
  primaryImageProps = {},
  secondaryImageProps = {},
  ...props
}) => {
  const secondaryImageSize = Math.floor(width / 2);

  return (
    <Wrapper position="relative" width={width} height={height} {...props}>
      <StyledPrimaryImage variant={variant} src={secondarySrc} width={width} height={height} {...secondaryImageProps} />
      <StyledSecondaryImage
        variant={variant}
        src={primarySrc}
        width={secondaryImageSize}
        height={secondaryImageSize}
        {...primaryImageProps}
      />
    </Wrapper>
  );
};

export default TokenPairImage;

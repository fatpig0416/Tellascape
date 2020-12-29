import React from 'react';
import { Shaders, Node } from 'gl-react';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
const PATH = '../../../assets/images/';

const shaders = Shaders.create({
    Nashville: {
        frag: `
            precision highp float;
            varying vec2 uv;
    
            uniform sampler2D inputImageTexture;
            uniform sampler2D inputImageTexture2;
    
            void main () {
                vec3 texel = texture2D(inputImageTexture, uv).rgb;
                texel = vec3(
                            texture2D(inputImageTexture2, vec2(texel.r, .83333)).r,
                            texture2D(inputImageTexture2, vec2(texel.g, .5)).g,
                            texture2D(inputImageTexture2, vec2(texel.b, .16666)).b);
                gl_FragColor = vec4(texel, 1.0);
    
            }
        `,
    },
});

export const Nashville = ({ children: inputImageTexture }) => (
    <Node
        shader={shaders.Nashville}
        uniforms={{
            inputImageTexture,
            inputImageTexture2: resolveAssetSource(
                require(`${PATH}filters/nashvilleMap.png`)
            ),
        }}
    />
);

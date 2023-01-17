Material → MeshStandardMaterial →
详见文档 MeshPhysicalMaterial
MeshStandardMaterial 的扩展，提供了更高级的基于物理的渲染属性：


Clearcoat: 有些类似于车漆，碳纤，被水打湿的表面的材质需要在面上再增加一个透明的，具有一定反光特性的面。而且这个面说不定有一定的起伏与粗糙度。Clearcoat 可以在不需要重新创建一个透明的面的情况下做到类似的效果。


基于物理的透明度:.opacity属性有一些限制:在透明度比较高的时候，反射也随之减少。使用基于物理的透光性.transmission属性可以让一些很薄的透明表面，例如玻璃，变得更真实一些。


高级光线反射: 为非金属材质提供了更多更灵活的光线反射。


PointsMaterial
用于粒子效果，后续会深入学习粒子特效
ShaderMaterial and RawShaderMaterial
在创建自己的 materials 时使用，后续会深入学习。用于创建 shaders



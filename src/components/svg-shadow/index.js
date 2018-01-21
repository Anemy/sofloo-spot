import React from 'react';

const getRandomColor = () => {
  const r = Math.floor(Math.random()*255);
  const g = Math.floor(Math.random()*255);
  const b = Math.floor(Math.random()*255);

  return `rgb(${r}, ${g}, ${b})`;
}

const SvgShadow = props => {
  console.log('shadow props', props);

  return (
  <filter id={props.shadowId}>
    {/* Shadow offset */}
    <feOffset dx={props.shadowOffsetX} dy={props.shadowOffsetY}/>
    {/* Shadow Blur */}
    <feGaussianBlur stdDeviation={props.shadowBlur}  result="offset-blur"/>
    {/* Invert the drop shadow to create an inner shadow  */}
    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result={props.shadowInset && "inverse"}/>
    {/* Color & Opacity */}
    <feFlood floodColor={props.randomShadow ? getRandomColor() : props.shadowColor} floodOpacity={props.shadowOpacity} result="color"/>
    {/* Clip color inside shadow */}
    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
    {/* Shadow Opacity */}
    <feComponentTransfer in="shadow" result="shadow">
        <feFuncA type="linear" slope={props.shadowOpacity}/>
    </feComponentTransfer>
    {/* Put shadow over original object */}
    {/* <feComposite operator="over" in="shadow" in2="SourceGraphic"/> */}
  </filter>
);
};

export default SvgShadow;

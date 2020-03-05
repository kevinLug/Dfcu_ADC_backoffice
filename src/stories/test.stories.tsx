import React from 'react';
import TestComponent from "../components/TestComponent";

export default {
    title: 'Testing',
    component: TestComponent,
};

export const Angella = () => <TestComponent name="Angella"/>;

export const Evelyn = () => <TestComponent name={<b>Evelyn</b>}/>;

export const NullValue = () => <TestComponent name={null}/>;


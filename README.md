# Component

[![Latest Stable Version](https://img.shields.io/npm/v/@pollen-solutions/component.svg?style=for-the-badge)](https://www.npmjs.com/package/@pollen-solutions/component)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE.md)

## Installation

```shell
npm i @pollen-solutions/component
```

## Usage 

```javascript
import {Component} from "@pollen-solutions/component"

myComponent = new Component(document.querySelector('#root'))

myComponent.setOption('sample-option.sub-sample-option', true)

console.log(myComponent.getOption('sample-option'))
```
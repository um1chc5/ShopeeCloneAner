import { addons, types } from '@storybook/manager-api'

addons.register('my-addon', () => {
  addons.add('my-addon/canvas', {
    title: 'Canvas',
    //👇 Sets the type of UI element in Storybook
    type: types.TAB,
    //👇 Shows the Toolbar UI element if the story canvas is being viewed
    match: ({ viewMode }) => viewMode === 'story',
    render: () => 'Canvas'
  })
})

addons.register('my-addon', () => {
  addons.add('my-addon/docs', {
    title: 'Docs',
    //👇 Sets the type of UI element in Storybook
    type: types.TAB,
    //👇 Shows the Toolbar UI element if the story canvas is being viewed
    match: ({ viewMode }) => viewMode === 'docs',
    render: () => 'Docs'
  })
})

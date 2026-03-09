## Customization

The Commitspark GraphQL schema can be used to request the editing frontend to choose specific editing UI components
for individual data fields. This is implemented via a GraphQL directive `@Ui`. See the
[GraphQL specification](http://spec.graphql.org/October2021/#sec-Type-System.Directives) for details on directives.

To use the directive, it must first be declared in the GraphQL schema file as follows:

```graphql
directive @Ui($ARGUMENTS) on FIELD_DEFINITION
```

The value of `$ARGUMENTS` depends on which specific customization features are to be available for use in the schema.
Combine the directive argument definitions of all customizations you want to use into a comma-separated string and
replace `$ARGUMENTS` with this string.

### visibleList

This directive argument allows specifying that a given text field of a GraphQL `@Entry` type is to be used for labeling
entries of that type in list views instead of the entry's ID field.

The concrete argument definition is as follows:

`visibleList:Boolean`

This directive can be applied to more than one field of an `@Entry` type.

#### Example

```graphql
directive @Ui(visibleList:Boolean) on FIELD_DEFINITION

type Page @Entry {
    id: ID!
    title: String! @Ui(visibleList:true)
    slug: String! @Ui(visibleList:true)
}
```
This will instruct the frontend to use the `title` and `slug` fields for labeling entries of type `Page` in list views.

### editor

This directive argument allows defining for a given text field of a GraphQL type, that the field is to be rendered with
a specific editor widget instead of the default single line text input.

The concrete argument definition is as follows:

`editor:String`

This directive can be applied to more than one field of an `@Entry` type.

#### Available Editors

##### multiline

Applying this value causes the annotated string field to be rendered with a plain text multi-line editor.

###### Example

```graphql
directive @Ui(editor:String) on FIELD_DEFINITION

type Page @Entry {
    id: ID!
    body: String! @Ui(editor: "multiline")
}
```

#### markdown

Applying this value causes the annotated string field to be rendered with a multi-line markdown editor, specifically
with [remarkjs](https://github.com/remarkjs/react-markdown).

###### Example

```graphql
directive @Ui(editor:String) on FIELD_DEFINITION

type Page @Entry {
    id: ID!
    body: String! @Ui(editor: "markdown")
}
```

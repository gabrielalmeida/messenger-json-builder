import * as R from "ramda";

// Messenger JSON Builder
const GenericTemplate = {
  attachment: {
    type: "template",
    payload: {
      template_type: "generic",
      elements: []
    }
  }
};

const ImageTemplate = {
  attachment: {
    type: "image",
    payload: {
      url: ""
    }
  }
};

const ButtonTemplate = {
  attachment: {
    type: "template",
    payload: {
      template_type: "button"
    }
  }
};

type ButtonType = "show_block" | "web_url" | "json_plugin_url";

interface Button {
  readonly type: ButtonType;
  readonly title: string;
  readonly block_names?: string[];
  readonly url?: string;
}

const buttonGenerator = (propName: string) =>
  R.curry((data: Button, element: object) =>
    R.merge(R.defaultTo({}, element), {
      [propName]: R.append(data, R.prop(propName, R.defaultTo({}, element)))
    })
  );

const Messenger = {
  button: buttonGenerator("buttons"),
  quickReply: buttonGenerator("quick_replies"),
  image: R.curry((url?: string, element?: object) =>
    R.merge(R.defaultTo({}, element), { image_url: url })
  ),
  text: R.curry((text: string, element: object) =>
    R.merge(R.defaultTo({}, element), { text })
  ),
  title: R.curry((title: string, element: object) =>
    R.merge(R.defaultTo({}, element), { title })
  ),
  getText: (text: string) => ({ text }),
  data: R.curry((data, element) => R.merge(R.defaultTo({}, element), data)),
  createElement: (items: ReadonlyArray<Function>, element?: object) =>
    R.call(R.apply(R.pipe, items as Function[]), R.defaultTo({}, element)),
  getImage: (url: string, template?: object) =>
    Messenger.addProp({ url })(
      R.defaultTo(Messenger.templates.image, template)
    ),
  getQuickReplies: (items: object[]) =>
    R.call(
      R.apply(R.pipe, R.map(Messenger.data, items)),
      {} // No template needed
    ),
  getButtons: (items: object[]) =>
    R.call(
      R.apply(R.pipe, R.map(Messenger.addProp, items)),
      Messenger.templates.button
    ),
  getGallery: (items: object[]) =>
    R.call(
      R.apply(R.pipe, R.map(Messenger.addElement, items)),
      Messenger.templates.generic
    ),
  addProp: R.curry((prop, template) => {
    const propLens = R.lensPath(["attachment", "payload"]);
    const genericTemplate = R.path(["templates", "generic"], Messenger);
    const getTemplate: object = R.cond([
      [R.isNil, R.always(genericTemplate)],
      [R.T, R.identity]
    ])(template);

    return R.over(propLens, R.merge(R.__, prop), getTemplate);
  }),
  addElement: R.curry((element, template) => {
    const elLens = R.lensPath(["attachment", "payload", "elements"]);
    const genericTemplate = R.path(["templates", "generic"], Messenger);
    const getTemplate: object = R.cond([
      [R.isEmpty, R.always(genericTemplate)],
      [R.T, R.identity]
    ])(template);

    return R.over(elLens, R.append(element), getTemplate);
  }),
  templates: {
    generic: GenericTemplate,
    image: ImageTemplate,
    button: ButtonTemplate
  },
  send: (items: ReadonlyArray<object>) => ({ messages: items })
};

export default Messenger;

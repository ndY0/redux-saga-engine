import LogicEngineManager from "../../../../../../../sagas/logic-engine";

const hookFactory = adaptater => (engine, mapPropsToAdapterArgs = args => args) => (props) => {
    const mappedArgs = mapPropsToAdapterArgs({ ...props });
    adaptater(LogicEngineManager, engine, mappedArgs);
}

export default hookFactory;
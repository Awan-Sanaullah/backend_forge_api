import React, { useContext, useMemo } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import AddButton from '../AddButton';
import RemoveButton from '../RemoveButton';
import { SplitLine, FillLine, CleanLine } from '../Lines';
import DefaultNode from '../DefaultNode';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';
import type { INode, IRender } from '../index';

interface IProps {
  parentNode?: INode;
  conditionIndex: number;
  renderNext: (params: IRender) => React.ReactNode;
}

const ConditionNode: React.FC<IProps> = (props) => {
  const { parentNode, conditionIndex, renderNext } = props;

  const {
    layout,
    spaceX,
    spaceY,
    readonly,
    registerNodes,
    nodes,
    beforeNodeClick,
    sortable,
    sortableAnchor,
  } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { clickNode, removeNode } = useAction();

  const conditionCount = Array.isArray(parentNode?.children)
    ? parentNode?.children.length || 0
    : 0;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const ConditionDragHandle = useMemo(
    () =>
      SortableHandle(() => {
        return (
          <span className="flow-builder-sortable-handle">
            {sortableAnchor || ':::'}
          </span>
        );
      }),
    [sortableAnchor],
  );

  const handleNodeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await beforeNodeClick?.(node);
      clickNode();
    } catch (error) {
      console.log('node click error', error);
    }
  };

  return (
    <div
      className={`flow-builder-node flow-builder-condition-node ${
        registerNode?.className || ''
      }`}
      style={{
        padding: layout === 'vertical' ? `0 ${spaceX}px` : `${spaceY}px 0`,
      }}
    >
      <SplitLine />

      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        {sortable ? <ConditionDragHandle /> : null}
        <Component
          readonly={readonly}
          node={node}
          nodes={nodes}
          remove={removeNode}
        />
        <RemoveButton />
      </div>

      <AddButton />

      {Array.isArray(node.children)
        ? renderNext({
            nodes: node.children,
            parentNode: node,
          })
        : null}

      <FillLine />

      {conditionCount > 1 && conditionIndex === 0 ? (
        <>
          <CleanLine className="clean-left clean-top" />
          <CleanLine className="clean-left clean-bottom" />
        </>
      ) : null}

      {conditionCount > 1 && conditionIndex === conditionCount - 1 ? (
        <>
          <CleanLine className="clean-right clean-top" />
          <CleanLine className="clean-right clean-bottom" />
        </>
      ) : null}
    </div>
  );
};

export default ConditionNode;

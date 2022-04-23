import React, { memo, useState, useEffect } from 'react';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, DomEditor } from '@wangeditor/editor';
import { toolbarConfig } from './config';
import { Button } from 'antd';

const WangEditor = memo((props) => {
  const { submit, cancel, isShowCancel, confirmText } = props;
  const [editor, setEditor] = useState(IDomEditor); // 存储 editor 实例
  const [html, setHtml] = useState(''); // 编辑器内容

  const editorConfig = {
    placeholder: '请输入内容...',
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={(editor) => setHtml(editor.getHtml())}
        mode="default"
        style={{ minHeight: '100px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {isShowCancel ? (
          <Button onClick={cancel} size="small">
            取消
          </Button>
        ) : (
          ''
        )}

        <Button
          onClick={(e) => submit(editor, html)}
          style={{ marginLeft: '8px' }}
          type="primary"
          size="small"
        >
          {confirmText || '提交'}
        </Button>
      </div>
    </div>
  );
});

export default WangEditor;

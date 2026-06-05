import { useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import React from "react";
import { useCrypto } from "../context/crypto-context";
import { capitalize } from "../utils";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function AppTransactions() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { transactions, setTransactions, setAssets } = useCrypto();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const data = transactions.map((asset, index) => {
    return {
      key: asset.id + "-" + index,
      originalIndex: index,
      name: asset.id,
      icon: asset.icon,
      date: asset.date,
      amount: asset.amount,
      price_bought: asset.price,
      total_cost: asset.amount * asset.price,
    };
  });

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      date: "",
      amount: "",
      price_bought: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const dataRecord = data.find((item) => item.key === key);
      if (!dataRecord) {
        console.warn("Transaction with key not found:", key);
        setEditingKey("");
      }

      const transactionIndex = dataRecord.originalIndex;
      const newTransactions = [...transactions];
      const originalTransaction = newTransactions[transactionIndex];
      const updateTransaction = {
        ...originalTransaction,
        date: row.date,
        amount: parseFloat(row.amount),
        price: parseFloat(row.price_bought),
      };

      newTransactions.splice(transactionIndex, 1, updateTransaction);
      setTransactions(newTransactions);
      setAssets(newTransactions);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Coin",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <span className="">{capitalize(text)}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      editable: true,
      render: (text) => {
        const dateObj = new Date(text);

        return dateObj.toLocaleDateString("en-US");
      },
    },
    {
      title: "Quantity",
      dataIndex: "amount",
      key: "amount",
      editable: true,
      render: (text) => parseFloat(text).toFixed(6),
    },
    {
      title: "Price",
      dataIndex: "price_bought",
      key: "price_bought",
      editable: true,
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: "Total",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginInlineEnd: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    const isNumberInput =
      col.dataIndex === "amount" || col.dataIndex === "price_bought";

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: isNumberInput ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="bg-backGr p-4">
      <div className="p-4 rounded-lg shadow-xl">
        <h1 className="text-white text-4xl font-display mb-8">
          Transaction History
        </h1>
        <Form form={form} component={false}>
          <Table
            columns={mergedColumns}
            dataSource={data}
            components={{
              body: { cell: EditableCell },
            }}
            bordered
            pagination={{ onChange: cancel }}
          />
        </Form>
      </div>
    </div>
  );
}

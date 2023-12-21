import React, { useState, useRef } from "react";
import { Table, Input, Button, Upload } from "antd";
const ECO_VALUE = "E";

const Export = () => {
  const listDataDefault = useRef(null);
  const dataDefault = [...Array(5)].map(() => Array(5).fill(""));
  const [data, setData] = useState(dataDefault);
  const [listData, setListData] = useState<any>(listDataDefault.current || []);
  const [valueInput, setValueInput] = useState<any>("");

  const handleInputChange = (value, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const columns = [...Array(5)].map((_, colIndex) => ({
    title: `Column ${colIndex + 1}`,
    dataIndex: colIndex,
    key: colIndex,
    render: (_, record, rowIndex) => {
      const isMiddleCell = rowIndex === 2 && colIndex === 2;
      if (isMiddleCell) {
        return (
          <span className="flex w-full bg-red-600 text-white justify-center">
            {ECO_VALUE}
          </span>
        );
      }
      return (
        <Input
          value={data[rowIndex][colIndex]}
          onChange={(e) =>
            handleInputChange(e.target.value, rowIndex, colIndex)
          }
        />
      );
    },
  }));

  const dataSource = [...Array(5)].map((_, index) => ({ key: index }));

  const handleSubmit = () => {
    const newListData = [...listData, data];
    setListData(newListData);
    setData(dataDefault);
  };

  console.log("listData", listData);

  const downloadJsonFile = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    console.log("filename", filename);

    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    const name = filename || "name_default";
    link.download = name + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dataExport = {
    data: listData,
  };

  const handleFileRead = (event) => {
    const content = event.target.result;
    try {
      const jsonData = JSON.parse(content);
      listDataDefault.current = jsonData?.data;
      setListData(jsonData?.data);
    } catch (e) {}
  };

  const handleFileChosen = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  const handleDelete = (index) => {
    const newListData = listData?.filter((x, idx) => idx !== index);
    setListData(newListData);
  };

  return (
    <div className="mx-4 mb-5">
      <div className="mb-3">
        <div className="mb-1 mt-2">Tải file json cũ: (Nếu có)</div>
        <Upload
          beforeUpload={(file) => {
            handleFileChosen(file);
            // Ngăn chặn việc upload tự động
            return false;
          }}
          accept=".json"
          onRemove={() => {
            listDataDefault.current = null;
            setListData([]);
          }}
        >
          <Button>Select JSON File</Button>
        </Upload>
      </div>
      <div className="mb-2">Nhập tên file json:</div>
      <Input
        value={valueInput}
        onChange={(e) => setValueInput(e.target.value?.trim())}
        placeholder="Nhập tên file json"
        className="mb-4"
      />
      <div className="mb-1">Thêm mới Bingo:</div>
      <Table
        style={{
          maxWidth: 400,
        }}
        showHeader={false}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        size="small"
      />
      <Button className="mt-2" onClick={handleSubmit}>
        Add
      </Button>
      <div className="flex flex-row items-center justify-between mt-4 mb-1">
        <div className="text-lg">{`Total: ${listData?.length}`}</div>
        <Button
          className="mr-10"
          onClick={() => downloadJsonFile(dataExport, valueInput)}
          disabled={listData?.length === 0}
        >
          Export
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 items-center">
        {listData?.map((ele, idx) => (
          <div key={idx}>
            <div className="flex flex-row justify-between items-center">
              <span className="flex justify-center text-xl mb-1 grow">{`Bingo ${
                idx + 1
              }`}</span>
              <span
                className="text-red-900 cursor-pointer text-xs"
                onClick={() => handleDelete(idx)}
              >
                Xóa
              </span>
            </div>
            <Table
              showHeader={false}
              key={idx}
              dataSource={ele?.map((data) => ({
                key: idx,
                name: data,
              }))}
              columns={ele.map((_, colIndex) => ({
                dataIndex: colIndex,
                key: colIndex,
                render: (_, record, rowIndex) => {
                  const isMiddleCell = rowIndex === 2 && colIndex === 2;
                  if (isMiddleCell) {
                    return (
                      <span className="flex w-full bg-red-600 text-white justify-center">
                        {ECO_VALUE}
                      </span>
                    );
                  }
                  return (
                    <div className="flex justify-center">
                      {ele[rowIndex][colIndex]}
                    </div>
                  );
                },
              }))}
              pagination={false}
              bordered
              size="small"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Export;

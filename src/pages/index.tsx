import React, { useCallback, useState, useRef } from "react";
import { Table, Input, Button, Upload } from "antd";
import dataSample from "./dataSample.json";
import {
  getDiagonalNumberArray,
  getHorizontalNumberArray,
  getVerticalNumberArray,
} from "../helpers";

const ECO_VALUE = "E";

const InputTable = () => {
  // const listDataDefault = dataSample?.data?.map((ele) =>
  //   ele?.map((x) => x?.map((y) => y?.toString()))
  // );
  const listDataDefault = useRef(null);
  const [listData, setListData] = useState<any>([]);
  const [valueInput, setValueInput] = useState<any>("");

  console.log("listData", listData);

  const handleChangeBingoNumber = (e) => {
    if (!e.target.value?.trim()) {
      setListData(listDataDefault.current);
    }
    setValueInput(e.target.value);
  };

  const numberArr = [ECO_VALUE, ...valueInput?.split(",")]?.map((x) =>
    x?.trim()
  );

  const handleFilterBingoTable = useCallback(() => {
    if (!valueInput?.trim()) {
      setListData(listDataDefault.current);
      return;
    }
    const newListData = listDataDefault?.current?.filter((ele) => {
      const horizontalArray = ele;
      const verticalArray = getVerticalNumberArray(ele);
      const diagonalArray = getDiagonalNumberArray(ele);
      const isExistInHorizontalArray = horizontalArray?.some((x) =>
        x?.every((y) => numberArr?.includes(y))
      );
      const isExistInVerticalArray = verticalArray?.some((x) =>
        x?.every((y) => numberArr?.includes(y))
      );
      const isExistInDiagonalArrayArray = diagonalArray?.some((x) =>
        x?.every((y) => numberArr?.includes(y))
      );
      return !!(
        isExistInHorizontalArray ||
        isExistInVerticalArray ||
        isExistInDiagonalArrayArray
      );
    });
    setListData(newListData);
  }, [
    listDataDefault.current,
    numberArr,
    getDiagonalNumberArray,
    getVerticalNumberArray,
  ]);

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

  return (
    <div className="mx-4">
      <div>
        <div className="mb-1 mt-2">Tải file json:</div>
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
      <div className="mt-4 text-lg">Vui lòng nhập dãy số Bingo:</div>
      <div className="text-sm mb-2">
        ⚠️ Lưu ý: Chỉ nhập số và mỗi số ngăn cách nhau bởi dấu ","
      </div>
      <Input
        value={valueInput}
        onChange={handleChangeBingoNumber}
        placeholder="Nhập dãy số Bingo"
      />
      <Button className="mb-3 mt-2" onClick={handleFilterBingoTable}>
        Tìm kiếm
      </Button>
      <div className="flex flex-row items-center justify-between">
        <div className="mt-2 text-lg mb-2">{`Kết quả: ${listData?.length}/${
          listDataDefault?.current?.length || 0
        }`}</div>
        <Button
          className="mr-10"
          onClick={() => setListData(listDataDefault.current)}
        >
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 items-center">
        {listData?.map((ele, idx) => (
          <div>
            <span className="flex justify-center text-xl mb-1">{`Bingo ${
              idx + 1
            }`}</span>
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
                  if (numberArr?.includes(ele[rowIndex][colIndex])) {
                    return (
                      <div className="flex w-full bg-red-600 text-white justify-center">
                        {ele[rowIndex][colIndex]}
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex justify-center">
                        {ele[rowIndex][colIndex]}
                      </div>
                    );
                  }
                },
              }))}
              pagination={false}
              bordered
              size="middle"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputTable;

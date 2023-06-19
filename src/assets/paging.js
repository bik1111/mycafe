export const pagination = async(rows, currPage, displayRowCnt, displayPageCnt) => {

    const totalPage = Math.ceil(rows.length / displayRowCnt);
    const startPage = Math.floor((currPage - 1) / displayPageCnt) * displayPageCnt + 1;
      
    let endPage = startPage + (displayPageCnt - 1);
    endPage = totalPage < endPage ? totalPage : endPage;
      
    const no = displayRowCnt * (currPage - 1);
      
    const myresult = rows.splice(no, displayRowCnt);
    
    return {
        startPage: startPage,
        endPage: endPage,
        totalPage: totalPage,
        currPage: currPage,
        myresult: myresult,
      };
    };

const page = async () => {
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/allnetworks");
      const result = await response.json();

      // Access the data from your response structure
      const data = result.data.result[0].value_usd;

      // Now you can use the data
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const totalUsdValue = await fetchData();
  console.log("totalUsdValue", totalUsdValue);
  return (
    <div>
      <div>total usd value: </div>
      <div>{totalUsdValue}</div>
    </div>
  );
};

export default page;

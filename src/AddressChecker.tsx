import axios from 'axios';
import { useState } from 'react';

interface AddressData {
  address: string;
  totalCoin: number;
  availableAmount: number;
  alreadyClaimAmount: number;
}

const AddressChecker = () => {
  const [addresses, setAddresses] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressData, setAddressData] = useState<AddressData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    const addressList = addresses.split('\n').filter(address => address.trim() !== '');
    const newAddressData: AddressData[] = [];

    for (const address of addressList) {
      try {
        console.log(`正在请求地址: ${address}`);
        const response = await axios.get(`https://api.wukongfb.xyz/coins/wukong?address=${address}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        console.log('响应数据:', response);
        console.log('响应内容类型:', response.headers['content-type']);
        console.log('响应状态:', response.status);
        console.log('响应文本:', response.data);

        if (typeof response.data === 'string') {
          console.error('收到了 HTML 响应而不是 JSON');
          // 可能需要在这里添加一些错误处理逻辑
        } else if (response.data && response.data.data) {
          const { total_coin, available_amount, already_claim_amount } = response.data.data;
          newAddressData.push({
            address,
            totalCoin: total_coin,
            availableAmount: available_amount,
            alreadyClaimAmount: already_claim_amount,
          });
        } else {
          console.error('响应数据格式不正确:', response.data);
        }
      } catch (error) {
        console.error(`获取地址 ${address} 的数据时出错:`, error);
        if (axios.isAxiosError(error)) {
          console.error('Axios 错误详情:', error.response?.data);
        }
      }
    }

    if (newAddressData.length === 0) {
      setError('无法获取地址数据。请检查地址是否正确，或稍后再试。');
    }

    console.log('处理后的数据:', newAddressData);
    setAddressData(newAddressData);
    setLoading(false);
  };

  return (
    <div>
      <textarea
        value={addresses}
        onChange={(e) => setAddresses(e.target.value)}
        placeholder="请输入区块链地址，每行一个"
        rows={5}
        cols={50}
      />
      <button onClick={handleCheck} disabled={loading}>
        {loading ? '正在检查...' : '检查地址'}
      </button>
      <p>状态: {loading ? '加载中' : '就绪'}</p>
      <p>地址数量: {addressData.length}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {addressData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>地址</th>
              <th>获得</th>
              <th>待领取</th>
              <th>已领取</th>
            </tr>
          </thead>
          <tbody>
            {addressData.map((data, index) => (
              <tr key={index}>
                <td>{data.address}</td>
                <td>{data.totalCoin}</td>
                <td>{data.availableAmount}</td>
                <td>{data.alreadyClaimAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddressChecker;

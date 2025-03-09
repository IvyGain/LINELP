// Google Sheets API の設定
const GAS_URL = 'デプロイ後に表示されたWebアプリのURL';
const API_SECRET = 'your-custom-secret-key';  // Code.jsで設定したものと同じ値

// キャッシュとしてのローカル設定
let courseConfig = {
    remainingSeats: 12,
    totalSeats: 12,
    lastUpdated: new Date().toISOString()
};

// Google Apps Scriptから設定を取得する関数
async function fetchConfig() {
    try {
        const response = await fetch(GAS_URL);
        
        if (!response.ok) {
            throw new Error('APIの呼び出しに失敗しました');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // キャッシュを更新
        courseConfig = data;
        return courseConfig;
    } catch (error) {
        console.error('設定の取得に失敗しました:', error);
        return courseConfig; // エラー時はキャッシュを返す
    }
}

// 残り席数を更新する関数
async function updateRemainingSeats(newCount) {
    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: API_SECRET,
                remainingSeats: newCount
            })
        });

        if (!response.ok) {
            throw new Error('APIの更新に失敗しました');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // キャッシュを更新
        courseConfig = data;
        return courseConfig;
    } catch (error) {
        console.error('席数の更新に失敗しました:', error);
        throw error;
    }
}

// 管理者用の更新関数
async function adminUpdateSeats(newCount, password) {
    if (password !== API_SECRET) {
        throw new Error('認証に失敗しました');
    }
    
    return await updateRemainingSeats(newCount);
}

export { courseConfig, fetchConfig, updateRemainingSeats, adminUpdateSeats }; 
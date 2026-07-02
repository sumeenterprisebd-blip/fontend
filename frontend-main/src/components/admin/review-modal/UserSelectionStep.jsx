import ExistingUserSelection from './ExistingUserSelection';
import NewUserForm from './NewUserForm';

export default function UserSelectionStep({
    userSelectionMode,
    setUserSelectionMode,
    users,
    fetchingData,
    selectedUser,
    setSelectedUser,
    newUserFirstName,
    setNewUserFirstName,
    newUserLastName,
    setNewUserLastName,
    newUserEmail,
    setNewUserEmail,
    error,
    setError,
    onNext
}) {
    const handleExistingUserSelect = (user) => {
        setSelectedUser(user);
        setError('');
        onNext();
    };

    return (
        <div>
            <p className="text-gray-600 mb-4">Select or create a user for this review</p>

            {/* Toggle between existing and new user */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => {
                        setUserSelectionMode('existing');
                        setError('');
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${userSelectionMode === 'existing'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Existing User
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setUserSelectionMode('new');
                        setError('');
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${userSelectionMode === 'new'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    New User
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Existing User Selection */}
            {userSelectionMode === 'existing' && (
                <ExistingUserSelection
                    users={users}
                    fetchingData={fetchingData}
                    onUserSelect={handleExistingUserSelect}
                />
            )}

            {/* New User Form */}
            {userSelectionMode === 'new' && (
                <NewUserForm
                    newUserFirstName={newUserFirstName}
                    setNewUserFirstName={setNewUserFirstName}
                    newUserLastName={newUserLastName}
                    setNewUserLastName={setNewUserLastName}
                    newUserEmail={newUserEmail}
                    setNewUserEmail={setNewUserEmail}
                    error={error}
                    setError={setError}
                    onContinue={onNext}
                />
            )}
        </div>
    );
}

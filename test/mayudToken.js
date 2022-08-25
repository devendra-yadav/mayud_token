
const {loadFixture} = require('@nomicfoundation/hardhat-network-helpers');
const {ethers} = require('hardhat');
const {expect} = require('chai');

let humanReadableTokenAmount = (n) => {
    return ethers.utils.parseEther(n.toString());
}

let formatEther = (n) => {
    return ethers.utils.formatEther(n.toString());

}

describe('MayudToken', () => {
    async function contractDeployment(){
        const [deployer, holder1, holder2, developmentWallet, marketingWallet] = await ethers.getSigners();
        let MayudToken = await ethers.getContractFactory('MayudToken');
        let mayudToken = await MayudToken.deploy();
        await mayudToken.deployed();

        //set marketting and developmentWallet
        mayudToken.setMarketingWallet(marketingWallet.address);
        mayudToken.setDevelopmentWallet(developmentWallet.address);

        return{deployer, mayudToken, holder1, holder2, developmentWallet, marketingWallet};
    }    

    describe("Token Deployment", ()=>{
        it("should deploy a token", async ()=>{
            const {deployer, mayudToken} = await loadFixture(contractDeployment);
            console.log(`MayudToken deployed at: ${mayudToken.address}`);
            expect(mayudToken.address).to.be.properAddress;
        })
    })

    describe("Token functionality", () => {
        it("should have initial supply of 1 billion tokens", async () => {
            const {deployer, mayudToken} = await loadFixture(contractDeployment);

            let initialSupply = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Balance of deployer ${initialSupply}`);
            expect(initialSupply).to.be.equal('100000000000.0');
        })

        it("should be able to mint new tokens", async ()=>{
            const {deployer, mayudToken} = await loadFixture(contractDeployment);

            await mayudToken.mint(deployer.address, 100000);

            let currentSupply = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Current Supply ${currentSupply}`);
            expect(currentSupply).to.be.equal('100000100000.0');
        })

        it("should be able to transfer tokens from deployer to holders", async ()=> {
            const {deployer, mayudToken, holder1, holder2} = await loadFixture(contractDeployment);
            let deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance Before : ${deployerBalance}`);

            await mayudToken.transfer(holder1.address, humanReadableTokenAmount(1000000));

            let holder1Balance = formatEther(await mayudToken.balanceOf(holder1.address));
            console.log(`Holder1 Balance : ${holder1Balance}`);

            deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance after : ${deployerBalance}`);

            expect(deployerBalance).to.equal('99999000000.0');
            expect(holder1Balance).to.equal('1000000.0');

        })

        it("should be able to transfer tokens from holder1 to holder2 with proper fee deductions", async ()=> {
            const {deployer, mayudToken, holder1, holder2, developmentWallet, marketingWallet} = await loadFixture(contractDeployment);
            let deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance Before : ${deployerBalance}`);

            //Deployer to send some balance to holder1 so that he can transfer.
            await mayudToken.transfer(holder1.address, humanReadableTokenAmount(1000000));


            //Holder1 to transfert to holder2
            await mayudToken.connect(holder1).transfer(holder2.address, humanReadableTokenAmount(50000));

            let holder1Balance = formatEther(await mayudToken.balanceOf(holder1.address));
            console.log(`Holder1 Balance : ${holder1Balance}`);

            let holder2Balance = formatEther(await mayudToken.balanceOf(holder2.address));
            console.log(`Holder2 Balance : ${holder2Balance}`);

            deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance after : ${deployerBalance}`);

            let marketingWalletBalance = formatEther(await mayudToken.balanceOf(marketingWallet.address));
            console.log(`marketingWallet Balance after : ${marketingWalletBalance}`); 

            let developmentWalletBalance = formatEther(await mayudToken.balanceOf(developmentWallet.address));
            console.log(`developmentWallet Balance after : ${developmentWalletBalance}`); 

            expect(deployerBalance).to.equal('99999000000.0');
            expect(holder1Balance).to.equal('950000.0');
            expect(holder2Balance).to.equal('48000.0');
            expect(marketingWalletBalance).to.equal('1000.0');
            expect(developmentWalletBalance).to.equal('1000.0');

        })

        it("deployer should be able to burn tokens", async ()=>{
            const {deployer, mayudToken, holder1, holder2} = await loadFixture(contractDeployment);

            let deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance Before : ${deployerBalance}`);

            await mayudToken.burn(humanReadableTokenAmount(60000000000));

            deployerBalance = formatEther(await mayudToken.balanceOf(deployer.address));
            console.log(`Deployer Balance After : ${deployerBalance}`);

            expect(deployerBalance).to.be.equal('40000000000.0');

        })

        it("token holders should be able to burn tokens", async ()=>{
            const {deployer, mayudToken, holder1, holder2} = await loadFixture(contractDeployment);

            let totalSupply = formatEther(await mayudToken.totalSupply());
            console.log(`Totalsupply Before : ${totalSupply}`);

            await mayudToken.transfer(holder1.address, humanReadableTokenAmount(2000000000));

            let holder1Balance = formatEther(await mayudToken.balanceOf(holder1.address));
            console.log(`holder1 Balance Before burn : ${holder1Balance}`);

            await mayudToken.connect(holder1).burn(humanReadableTokenAmount(5000000));

            holder1Balance = formatEther(await mayudToken.balanceOf(holder1.address));
            console.log(`holder1 Balance After burn : ${holder1Balance}`);

            totalSupply = formatEther(await mayudToken.totalSupply());
            console.log(`totalSupply After : ${totalSupply}`);

            expect(holder1Balance).to.be.equal('1995000000.0');
            expect(totalSupply).to.be.equal('99995000000.0');

        })
    })
})
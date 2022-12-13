import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useFormContext } from 'react-hook-form'

import Header from '../../../../components/Header'
import { Checkbox, FormControlLabel, Link, useTheme } from '@mui/material'
import { AlertIcon, CheckIcon } from '../../../../components/Icons'
import { Controller } from 'react-hook-form'
import { useNetwork } from 'wagmi'

const Confirmation: React.FC<any> = (props) => {
  const { palette } = useTheme()
  const { getValues, control } = useFormContext()
  const { name, symbol, founders, voting } = getValues()
  const { chain } = useNetwork()

  return (
    <>
      <Header
        title="Confirmation"
        subtitle="Please make sure your name and token symbol are correct. Note: we know getting started can seem confusing, so we help take the guess work out of it by providing  default settings. All of these settings can be adjusted after you deploy your LLC."
      />
      <Card sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}>
        <Typography variant="subtitle1" color={palette.grey[900]} fontWeight={500}>
          Structure
        </Typography>
        <Divider orientation="horizontal" sx={{ m: '20px 0 16px' }} />
        <Typography variant="caption" color={palette.grey[500]} m="0">
          Structure
        </Typography>
        <Typography variant="subtitle2" color={palette.grey[900]} m="0">
          Delaware Series LLC
        </Typography>
      </Card>
      <Card sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}>
        <Typography variant="subtitle1" color={palette.grey[900]} fontWeight={500}>
          Name
        </Typography>
        <Divider orientation="horizontal" sx={{ m: '20px 0 16px' }} />
        <Typography variant="caption" color={palette.grey[500]} m="0">
          On-Chain name
        </Typography>
        <Typography
          m="0"
          variant="subtitle2"
          color={palette.grey[900]}
          fontWeight={500}
          sx={{ display: 'flex' }}
          data-testid="dao-name"
        >
          {name}
        </Typography>
        <Typography
          variant="subtitle2"
          color={palette.warning.dark}
          fontWeight={600}
          sx={{ display: 'flex', mt: '16px' }}
        >
          <AlertIcon stroke={palette.warning.dark} sx={{ fill: '#fff', mr: '14px' }} /> DAO Name cannot be changed
          later.
        </Typography>
        <Divider orientation="horizontal" sx={{ m: '16px 0' }} />
        <Typography variant="caption" color={palette.grey[500]} m="0">
          Token symbol
        </Typography>
        <Typography variant="subtitle2" color={palette.grey[900]} fontWeight={500} data-testid="token-symbol">
          {symbol}
        </Typography>
        <Typography
          variant="subtitle2"
          color={palette.warning.dark}
          fontWeight={600}
          sx={{ display: 'flex', mt: '16px' }}
        >
          <AlertIcon stroke={palette.warning.dark} sx={{ fill: '#fff', mr: '14px' }} /> DAO Symbol cannot be changed
          later.
        </Typography>
        <Divider orientation="horizontal" sx={{ m: '16px 0' }} />
        <Typography variant="caption" color={palette.grey[500]} m="0">
          Deploying on
        </Typography>
        <Typography variant="subtitle2" color={palette.grey[900]} fontWeight={500} data-testid="chain-name">
          {chain?.name}
        </Typography>
      </Card>
      <Card sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}>
        <Typography variant="subtitle1" color={palette.grey[900]} fontWeight={500}>
          Governance
        </Typography>
        <Divider orientation="horizontal" sx={{ m: '20px 0 16px' }} />
        <Typography display="flex" variant="caption" color={palette.grey[500]} m="0">
          Voting Period
          <Tooltip
            arrow
            title={
              <Typography variant="caption">
                This is the time period proposals for your company will be live for.
              </Typography>
            }
          >
            <img
              src="/icons/info-icon.svg"
              alt="Information Tooltip Icon"
              style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
            />
          </Tooltip>
        </Typography>
        <Typography variant="subtitle2" color={palette.grey[900]} m="0" fontWeight={500}>
          {voting.period.hours} hour(s)
        </Typography>
        <Divider orientation="horizontal" sx={{ m: '16px 0' }} />
        <Typography display="flex" variant="caption" color={palette.grey[500]} m="0">
          Quorum
          <Tooltip
            arrow
            title={
              <Typography variant="caption">
                This is the percentage of your LLC's tokens that need to vote on a proposal for it to be valid
              </Typography>
            }
          >
            <img
              src="/icons/info-icon.svg"
              alt="Information Tooltip Icon"
              style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
            />
          </Tooltip>
        </Typography>
        <Typography variant="subtitle2" color={palette.grey[900]} m="0" fontWeight={500}>
          {voting.quorum}%
        </Typography>
        <Divider orientation="horizontal" sx={{ m: '16px 0' }} />
        <Typography display="flex" variant="caption" color={palette.grey[500]} m="0">
          Approval Needed
          <Tooltip
            arrow
            title={
              <Typography variant="caption">
                This is the percentage of tokens that need to vote 'Yes' on a proposal for it to pass
              </Typography>
            }
          >
            <img
              src="/icons/info-icon.svg"
              alt="Information Tooltip Icon"
              style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
            />
          </Tooltip>
        </Typography>
        <Typography variant="subtitle2" color={palette.grey[900]} m="0" fontWeight={500}>
          {voting.approval}%
        </Typography>
      </Card>
      <Card sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}>
        <Typography variant="subtitle1" color={palette.grey[900]} fontWeight={500}>
          Token Features
        </Typography>
        <Divider orientation="horizontal" sx={{ m: '20px 0 16px' }} />
        <Grid item display="flex" alignItems="center" justifyContent="space-between" mb="5px">
          <Typography display="flex" variant="subtitle2" color={palette.grey[900]}>
            Redemption
            <Tooltip
              arrow
              title={
                <Typography variant="caption">
                  Allows token holders to burn or 'ragequit' their LLC's tokens for a proportionate share of whitelisted
                  treasury assets.
                </Typography>
              }
            >
              <img
                src="/icons/info-icon.svg"
                alt="Information Tooltip Icon"
                style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
              />
            </Tooltip>
          </Typography>
          <Grid item display="flex" alignItems="center" gap="10px">
            <CheckIcon sx={{ mt: '4px' }} />
            <Typography variant="caption">No</Typography>
          </Grid>
        </Grid>
        <Grid item display="flex" alignItems="center" justifyContent="space-between">
          <Typography display="flex" variant="subtitle2" color={palette.grey[900]}>
            Transferrable
            <Tooltip
              arrow
              title={
                <Typography variant="caption">
                  Tokens will be locked to the original recipient and will not be transferable until a proposal making
                  such a change is approved. Sporos requires your tokens be non-transferrable for U.S. compliance
                  reasons. While this setting can be changed after you create your LLC, we recommend consulting with an
                  attorney as it may change the legal standing of your entity.
                </Typography>
              }
            >
              <img
                src="/icons/info-icon.svg"
                alt="Information Tooltip Icon"
                style={{ marginLeft: '9px', cursor: 'pointer', fill: 'none' }}
              />
            </Tooltip>
          </Typography>
          <Grid item display="flex" alignItems="center" gap="10px">
            <CheckIcon sx={{ mt: '4px' }} />
            <Typography variant="caption">No</Typography>
          </Grid>
        </Grid>
      </Card>
      {founders?.map((founder: any, index: number) => (
        <Card
          key={index}
          sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}
        >
          <Typography variant="subtitle1" color={palette.grey[900]} fontWeight={500}>
            Founder
          </Typography>
          <Divider orientation="horizontal" sx={{ m: '20px 0 16px' }} />
          <Card>
            <Typography variant="caption" color={palette.grey[500]}>
              Address
            </Typography>
            <Typography
              variant="subtitle2"
              color={palette.grey[900]}
              fontWeight={500}
              data-testid={`founder.${index}.address`}
            >
              {founder.address}
            </Typography>
            <Divider orientation="horizontal" sx={{ m: '20px 0 16px' }} />
            <Typography variant="caption" color={palette.grey[500]}>
              Tokens
            </Typography>
            <Typography
              variant="subtitle2"
              color={palette.grey[900]}
              fontWeight={500}
              data-testid={`founder.${index}.initialTokens`}
            >
              {founder.initialTokens}
            </Typography>
            <Divider orientation="horizontal" sx={{ m: '20px 0 16px' }} />
            <Typography variant="caption" color={palette.grey[500]}>
              Email
            </Typography>
            <Typography
              variant="subtitle2"
              color={palette.grey[900]}
              fontWeight={500}
              data-testid={`founder.${index}.email`}
            >
              {founder.email}
            </Typography>
          </Card>
        </Card>
      ))}
      <Card sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}>
        <Divider orientation="horizontal" sx={{ m: '20px 0 16px' }} />
        <FormControlLabel
          sx={{ ml: '4px', mt: '24px' }}
          label="Agree with terms of use and privacy policy"
          control={
            <Controller
              name="terms"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Checkbox
                  ref={ref}
                  checked={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  inputProps={{ 'aria-label': 'Terms Checkbox' }}
                  icon={<img src="/icons/unchecked.svg" alt="Unchecked" />}
                  checkedIcon={<img src="/icons/checked.svg" alt="Unchecked" />}
                  data-testid="terms"
                />
              )}
            />
          }
        />
        <Typography variant="subtitle2" sx={{ mt: '-4px', ml: '24px', color: '#697586' }}>
          In order to continue you will have to accept our terms and conditions. You can read them{' '}
          <Link href="https://sporosdao.xyz/terms-and-conditions/" rel="noopener" target="_blank">
            here
          </Link>
          .
        </Typography>
      </Card>
    </>
  )
}

export default Confirmation
